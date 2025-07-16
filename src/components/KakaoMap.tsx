'use client';

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import {
  AllFranchiseResult,
  FranchiseCompany,
  FranchiseCompanyResult,
} from '@/types/apis/franchise/location';
import { AddressSearchResult, Latlng } from '@/types/kakaoMap/map';
import buildingIcon from '@/assets/images/franchise/marker_building.png';
import { isMobileUserAgent } from '../utils/platform';
import { initializeKakaoMaps } from '@/utils/kakaoMapsInit';

// Global lock to prevent multiple simultaneous initializations
let globalInitLock = false;

const KakaoMap = memo(forwardRef(
  (
    {
      location = '',
      longX = '',
      latY = '',
      companyList = { result: [], total: '0' },
      franchiesList = { result: [], total: '0' },
      allList = { result: [], total: '0' },
      markersData = [],
      markerClick,
      onMarkerClick,
      onCenterChange,
      shouldUpdateCenter, // 추가: 셀렉트 박스에서만 지도 중심 이동
      onCenterUpdated, // 추가: 중심 이동 후 상태 초기화
      isDragging,
      onMapReady,
      onZoomChange,
    }: {
      location: string;
      longX: string | number;
      latY: string | number;
      companyList: FranchiseCompanyResult;
      franchiesList: FranchiseCompanyResult;
      allList: AllFranchiseResult;
      markersData?: Array<{
        id: string;
        name: string;
        price: number;
        lat: number;
        lng: number;
        isSelected?: boolean;
        isClicked?: boolean;
      }>;
      // eslint-disable-next-line no-unused-vars
      markerClick: (company: FranchiseCompany) => void;
      // eslint-disable-next-line no-unused-vars
      onMarkerClick?: (id: string) => void;
      // eslint-disable-next-line no-unused-vars
      onCenterChange: (
        // eslint-disable-next-line no-unused-vars
        lat: string,
        // eslint-disable-next-line no-unused-vars
        lng: string,
        // eslint-disable-next-line no-unused-vars
        swLatLng: kakao.maps.LatLng,
        // eslint-disable-next-line no-unused-vars
        neLatLng: kakao.maps.LatLng,
      ) => void;
      shouldUpdateCenter: boolean; // 셀렉트 박스 기반 중심 이동 여부
      onCenterUpdated: () => void; // 중심 이동 후 콜백
      isDragging: boolean;
      // eslint-disable-next-line no-unused-vars
      onMapReady?: (map: kakao.maps.Map) => void;
      onZoomChange: (
        // eslint-disable-next-line no-unused-vars
        bounds: kakao.maps.LatLng,
        // eslint-disable-next-line no-unused-vars
        swLatLng: kakao.maps.LatLng,
        // eslint-disable-next-line no-unused-vars
        neLatLng: kakao.maps.LatLng,
        // eslint-disable-next-line no-unused-vars
        center: kakao.maps.LatLng,
      ) => void;
    },
    ref,
  ) => {
    const mapRef = useRef<HTMLDivElement>(null);
    /*eslint no-undef: "off"*/
    const mapInstance = useRef<kakao.maps.Map | null>(null);
    const markersRef = useRef<any[]>([]);
    const tooltipRef = useRef<any>(null);
    const isMapInitialized = useRef<boolean>(false);
    const initializationStarted = useRef<boolean>(false);
    const componentId = useRef<string>(`map-${Date.now()}-${Math.random()}`);

    if (longX === '' && latY === '' && location === '') {
      location = '서울'; // 기본값
      longX = '126.9780';
      latY = '37.5665';
    }

    // 주소 시/구/동/번지수(도로명) 까지만 분리
    const simplifyAddress = (address: string) => {
      return address?.split(' ').slice(0, 4).join(' ');
    };

    // 가격 포맷팅 함수
    const formatPrice = (price: number) => {
      if (price >= 10000) {
        return `${Math.floor(price / 10000)}만원`;
      }
      return `${price.toLocaleString()}원`;
    };

    // 커스텀 마커 DOM 엘리먼트 생성 함수
    const createCustomMarkerElement = (price: number, isSelected = false, isClicked = false) => {
      // 마커 컨테이너 (전체 클릭 영역)
      const markerContainer = document.createElement('div');
      markerContainer.style.cssText = `
        position: relative;
        display: inline-block;
        cursor: pointer;
        transform: translateX(-50%) translateY(-100%);
        z-index: 1000;
        user-select: none;
      `;

      // 메인 마커 바디
      const markerDiv = document.createElement('div');
      markerDiv.className = `custom-marker ${isSelected ? 'selected' : ''} ${isClicked ? 'clicked' : ''}`;
      
      // 클릭된 상태일 때는 파란색, 선택된 상태일 때는 빨간색, 기본은 흰색
      const backgroundColor = isClicked ? '#3B82F6' : (isSelected ? '#FF385C' : '#FFFFFF');
      const textColor = isClicked || isSelected ? '#FFFFFF' : '#222222';
      const borderColor = isClicked ? '#3B82F6' : (isSelected ? '#FF385C' : '#E0E0E0');
      
      markerDiv.style.cssText = `
        position: relative;
        background: ${backgroundColor};
        color: ${textColor};
        border: ${isClicked || isSelected ? '3px solid ' + borderColor : '2px solid #E0E0E0'};
        border-radius: 22px;
        padding: 8px 16px;
        font-size: 15px;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        white-space: nowrap;
        min-width: 60px;
        text-align: center;
        line-height: 1.2;
      `;
      markerDiv.textContent = formatPrice(price);

      // 아래 화살표 (꼬리)
      const arrow = document.createElement('div');
      const arrowColor = isClicked ? '#3B82F6' : (isSelected ? '#FF385C' : '#FFFFFF');
      arrow.style.cssText = `
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid ${arrowColor};
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      `;
      markerDiv.appendChild(arrow);

      // 화살표 테두리 (더 진한색)
      const arrowBorder = document.createElement('div');
      arrowBorder.style.cssText = `
        position: absolute;
        top: 98%;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 11px solid transparent;
        border-right: 11px solid transparent;
        border-top: 11px solid ${borderColor};
        z-index: -1;
      `;
      markerDiv.appendChild(arrowBorder);

      markerContainer.appendChild(markerDiv);

      // 호버 효과를 위한 CSS 클래스 추가 (클릭되거나 선택된 상태가 아닐 때만)
      markerContainer.addEventListener('mouseenter', () => {
        if (!isSelected && !isClicked) {
          markerDiv.style.background = '#F7F7F7';
          markerDiv.style.borderColor = '#CCCCCC';
          markerDiv.style.transform = 'scale(1.05)';
          markerDiv.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.25)';
          
          // 화살표 색상도 변경
          const arrow = markerDiv.children[0] as HTMLElement;
          const arrowBorder = markerDiv.children[1] as HTMLElement;
          if (arrow) {
            arrow.style.borderTopColor = '#F7F7F7';
          }
          if (arrowBorder) {
            arrowBorder.style.borderTopColor = '#CCCCCC';
          }
        }
      });

      markerContainer.addEventListener('mouseleave', () => {
        if (!isSelected && !isClicked) {
          markerDiv.style.background = '#FFFFFF';
          markerDiv.style.borderColor = '#E0E0E0';
          markerDiv.style.transform = 'scale(1)';
          markerDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          
          // 화살표 색상 원복
          const arrow = markerDiv.children[0] as HTMLElement;
          const arrowBorder = markerDiv.children[1] as HTMLElement;
          if (arrow) {
            arrow.style.borderTopColor = '#FFFFFF';
          }
          if (arrowBorder) {
            arrowBorder.style.borderTopColor = '#E0E0E0';
          }
        }
      });

      return markerContainer;
    };

    // 툴팁 HTML 생성 함수
    const createTooltipContent = (name: string) => {
      return `
        <div style="
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          transform: translateX(-25%) translateY(-180%);
          margin-top: -15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          z-index: 2000;
          max-width: 200px;
          text-align: center;
          line-height: 1.3;
        ">
          ${name}
          <div style="
            position: absolute;
            top: 0%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(0, 0, 0, 0.85);
          "></div>
        </div>
      `;
    };

    // 지도 초기화 (한 번만 실행)
    useEffect(() => {
      const currentComponentId = componentId.current;
      
      if (!mapRef.current || isMapInitialized.current || initializationStarted.current || globalInitLock) {
        console.log(`[${currentComponentId}] Skipping initialization - mapRef: ${!!mapRef.current}, isInitialized: ${isMapInitialized.current}, started: ${initializationStarted.current}, globalLock: ${globalInitLock}`);
        return;
      }

      // console.log(`[${currentComponentId}] Starting map initialization...`);
      
      // 짧은 딜레이로 컴포넌트 마운트/언마운트 사이클 안정화
      const initTimer = setTimeout(() => {
        // 다시 한 번 체크 (컴포넌트가 언마운트되었을 수도 있음)
        if (!mapRef.current || isMapInitialized.current || globalInitLock) {
          // console.log(`[${currentComponentId}] Delayed check: Skipping initialization`);
          return;
        }
        
        initializationStarted.current = true;
        globalInitLock = true;

        const initializeMap = async () => {
        try {
          // API 키 확인
          const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
          // console.log(`[${currentComponentId}] API Key exists:`, !!apiKey);
          // console.log(`[${currentComponentId}] API Key prefix:`, apiKey?.substring(0, 8) + '...');
          
          // Use the global initialization utility
          await initializeKakaoMaps();
          
          // console.log(`[${currentComponentId}] Kakao Maps is ready, initializing map...`);
          // 이미 초기화되었다면 중복 실행 방지
          if (isMapInitialized.current || !mapRef.current) {
            console.log(`[${currentComponentId}] Initialization aborted - already initialized or no mapRef`);
            globalInitLock = false;
            return;
          }

          const options = {
            center: new window.kakao.maps.LatLng(Number(latY), Number(longX)),
            level: 5,
          };

          // 컨테이너 크기 확인
          const containerRect = mapRef.current.getBoundingClientRect();
          // console.log(`[${currentComponentId}] Container size:`, {
          //   width: containerRect.width,
          //   height: containerRect.height,
          //   top: containerRect.top,
          //   left: containerRect.left
          // });

          if (containerRect.width === 0 || containerRect.height === 0) {
            // console.error(`[${currentComponentId}] Container has zero size! Cannot initialize map.`);
            globalInitLock = false;
            return;
          }

          const map = new window.kakao.maps.Map(mapRef.current, options);
          mapInstance.current = map;
          isMapInitialized.current = true;
          globalInitLock = false; // Release lock after successful initialization
          
          //console.log(`[${currentComponentId}] Map successfully created!`, map);

          let isMobile = false;
          const userAgent = navigator.userAgent || navigator.vendor || '';
          const isMobileScreen = window.innerWidth <= 480;
          const isMobileDevice = isMobileUserAgent(userAgent);

          isMobile = isMobileScreen || isMobileDevice;

          // 지도 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl();
          const zoomControl = new window.kakao.maps.ZoomControl();

          if (isMobile) {
            map.setMaxLevel(10);
          } else {
            map.setMaxLevel(8);
          }
          map.addControl(
            mapTypeControl,
            window.kakao.maps.ControlPosition.TOPRIGHT,
          );
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

          if (onMapReady) {
            // console.log(`[${currentComponentId}] Map is ready, calling onMapReady`);
            onMapReady(map);
            map.setDraggable(true);
          }

          window.kakao.maps.event.addListener(map, 'dragend', () => {
            const targetCenter = map.getCenter();
            const bounds = map.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();
            onCenterChange(
              targetCenter.getLat().toString(),
              targetCenter.getLng().toString(),
              neLatLng,
              swLatLng,
            );
            map.relayout();
          });

          // 줌 이벤트
          window.kakao.maps.event.addListener(map, 'zoom_changed', () => {
            const center = map.getCenter();
            const bounds = map.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();

            onZoomChange(bounds, swLatLng, neLatLng, center);
            map.relayout();
          });
        } catch (error) {
          // console.error(`[${currentComponentId}] Failed to initialize Kakao Maps:`, error);
          initializationStarted.current = false; // Reset on error
          globalInitLock = false; // Release lock on error
        }
      };

      // 지도 초기화 시작
      initializeMap();
      }, 50); // 50ms 딜레이

      // Cleanup function
      return () => {
        //console.log(`[${currentComponentId}] Component unmounting, cleaning up...`);
        
        // Clear the init timer
        clearTimeout(initTimer);
        
        // Clean up map instance first
        if (mapInstance.current) {
          try {
            // Remove any event listeners if needed
            mapInstance.current = null;
          } catch (error) {
            console.warn(`[${currentComponentId}] Error during map cleanup:`, error);
          }
        }
        
        // Reset all state flags
        isMapInitialized.current = false;
        initializationStarted.current = false;
        
        // Release global lock only if this component was the one that acquired it
        if (globalInitLock) {
          globalInitLock = false;
          console.log(`[${currentComponentId}] Released global lock`);
        }
      };
    }, []); // Remove dependencies to prevent re-initialization

    // 셀렉트 박스에서 지도 중심 업데이트
    useEffect(() => {
      const currentComponentId = componentId.current;
      
      if (shouldUpdateCenter && mapInstance.current && isMapInitialized.current) {
        console.log(`[${currentComponentId}] Updating center from select box to: ${latY}, ${longX}`);
        const map = mapInstance.current;
        const newCenter = new window.kakao.maps.LatLng(
          Number(latY),
          Number(longX),
        );
        map.setCenter(newCenter); // 지도 중심 이동
        onCenterUpdated(); // 중심 이동 후 상태 초기화
      } else if (shouldUpdateCenter) {
        console.warn(`[${currentComponentId}] Cannot update center - map not ready. ShouldUpdate: ${shouldUpdateCenter}, Initialized: ${isMapInitialized.current}, Instance: ${!!mapInstance.current}`);
      }
    }, [shouldUpdateCenter, latY, longX, onCenterUpdated]);

    // 마커 업데이트 (companyList, franchiesList, markersData 변경 시)
    useEffect(() => {
      const currentComponentId = componentId.current;
      
      if (!mapInstance.current || !isMapInitialized.current) {
        //console.log(`[${currentComponentId}] Skipping marker update - map not ready. Initialized: ${isMapInitialized.current}, Instance: ${!!mapInstance.current}`);
        return;
      }

      console.log(`[${currentComponentId}] Updating markers - markersData changed:`, markersData);

      const map = mapInstance.current;
      const bounds = new window.kakao.maps.LatLngBounds();
      const geocoder = new window.kakao.maps.services.Geocoder();

      // 기존 마커 제거 (강제)
      markersRef.current.forEach((marker) => {
        try {
          marker.setMap(null);
        } catch (error) {
          console.warn('Error removing marker:', error);
        }
      });
      markersRef.current = []; // 마커 배열 초기화

      // 툴팁 제거
      if (tooltipRef.current) {
        tooltipRef.current.setMap(null);
        tooltipRef.current = null;
      }

      const positions = [
        ...companyList.result,
        ...franchiesList.result,
        ...allList.result,
      ];

      // 짧은 딜레이 후 마커 재생성 (DOM 업데이트 시간 확보)
      setTimeout(() => {
        positions.forEach((position) => {
          // markersData에서 가격 정보와 선택 상태 찾기
          const markerData = markersData.find(marker => 
            marker.id === position.idx || 
            marker.id === position.id ||
            (marker.lat === parseFloat(position.geo_lat || '0') && marker.lng === parseFloat(position.geo_lng || '0'))
          );
          const price = markerData?.price || Math.floor(Math.random() * 100000) + 50000;
          const isSelected = markerData?.isSelected || false;
          const isClicked = markerData?.isClicked || false;
          const markerId = position.idx || position.id;

          // 디버깅 로그 추가
          if (isClicked || isSelected) {
            console.log(`[Marker ${markerId}] isSelected: ${isSelected}, isClicked: ${isClicked}, markerData:`, markerData);
          }

          if (
            position.geo_lat === null ||
            position.geo_lng === null ||
            position.geo_lat === '0' ||
            position.geo_lat === '0'
          ) {
            geocoder.addressSearch(
              simplifyAddress(position.company_address),
              (result: AddressSearchResult[], status: string) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const latitude = Number(result[0].y);
                  const longitude = Number(result[0].x);
                  const coords = new window.kakao.maps.LatLng(
                    latitude,
                    longitude,
                  );

                  // 커스텀 마커 엘리먼트 생성 (선택 상태 반영)
                  const markerElement = createCustomMarkerElement(price, isSelected, isClicked);
                  
                  // 커스텀 오버레이로 마커 생성
                  const customOverlay = new window.kakao.maps.CustomOverlay({
                    map,
                    position: coords,
                    content: markerElement,
                    yAnchor: 1,
                    xAnchor: 0.5,
                  });

                  markersRef.current.push(customOverlay);
                  bounds.extend(coords);

                  // 마커 클릭 이벤트
                  markerElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    markerClick(position);
                    // 추가: 마커 클릭 시 상위 컴포넌트에 알림
                    if (onMarkerClick && markerId) {
                      onMarkerClick(markerId);
                    }
                  });

                  // 툴팁용 타이머
                  let tooltipTimer: NodeJS.Timeout | null = null;

                  // 마우스 오버 이벤트 (툴팁 표시 + 상위 컴포넌트 알림)
                  markerElement.addEventListener('mouseenter', () => {
                    // 기존 타이머 클리어
                    if (tooltipTimer) {
                      clearTimeout(tooltipTimer);
                      tooltipTimer = null;
                    }

                    // 기존 툴팁 제거
                    if (tooltipRef.current) {
                      tooltipRef.current.setMap(null);
                    }

                    // 새 툴팁 생성 (약간의 지연)
                    tooltipTimer = setTimeout(() => {
                      tooltipRef.current = new window.kakao.maps.CustomOverlay({
                        map,
                        position: coords,
                        content: createTooltipContent(position.company_name),
                        yAnchor: 1.4,
                        xAnchor: 0.5,
                      });
                    }, 300); // 300ms 지연
                  });

                  // 마우스 아웃 이벤트 (툴팁 숨김 + 호버 해제 알림)
                  markerElement.addEventListener('mouseleave', () => {
                    // 타이머 클리어
                    if (tooltipTimer) {
                      clearTimeout(tooltipTimer);
                      tooltipTimer = null;
                    }

                    // 툴팁 제거
                    if (tooltipRef.current) {
                      tooltipRef.current.setMap(null);
                      tooltipRef.current = null;
                    }
                  });
                }
              },
            );
          } else {
            const coords = new window.kakao.maps.LatLng(
              position.geo_lat,
              position.geo_lng,
            );

            // 커스텀 마커 엘리먼트 생성 (선택 상태 반영)
            const markerElement = createCustomMarkerElement(price, isSelected, isClicked);
            
            // 커스텀 오버레이로 마커 생성
            const customOverlay = new window.kakao.maps.CustomOverlay({
              map,
              position: coords,
              content: markerElement,
              yAnchor: 1,
              xAnchor: 0.5,
            });

            markersRef.current.push(customOverlay);
            bounds.extend(coords);

            // 마커 클릭 이벤트
            markerElement.addEventListener('click', (e) => {
              e.stopPropagation();
              markerClick(position);
              // 추가: 마커 클릭 시 상위 컴포넌트에 알림
              if (onMarkerClick && markerId) {
                onMarkerClick(markerId);
              }
            });

            // 툴팁용 타이머
            let tooltipTimer: NodeJS.Timeout | null = null;

            // 마우스 오버 이벤트 (툴팁 표시 + 상위 컴포넌트 알림)
            markerElement.addEventListener('mouseenter', () => {
              // 기존 타이머 클리어
              if (tooltipTimer) {
                clearTimeout(tooltipTimer);
                tooltipTimer = null;
              }

              // 기존 툴팁 제거
              if (tooltipRef.current) {
                tooltipRef.current.setMap(null);
              }

              // 새 툴팁 생성 (약간의 지연)
              tooltipTimer = setTimeout(() => {
                tooltipRef.current = new window.kakao.maps.CustomOverlay({
                  map,
                  position: coords,
                  content: createTooltipContent(position.company_name),
                  yAnchor: 1.4,
                  xAnchor: 0.5,
                });
              }, 300); // 300ms 지연
            });

            // 마우스 아웃 이벤트 (툴팁 숨김 + 호버 해제 알림)
            markerElement.addEventListener('mouseleave', () => {
              // 타이머 클리어
              if (tooltipTimer) {
                clearTimeout(tooltipTimer);
                tooltipTimer = null;
              }

              // 툴팁 제거
              if (tooltipRef.current) {
                tooltipRef.current.setMap(null);
                tooltipRef.current = null;
              }
            });
          }
        });

        // 모든 마커가 보이도록 지도 확대/축소
        if (!isDragging) {
          map.setBounds(bounds);
        }
      }, 10); // 10ms 딜레이
    }, [companyList, franchiesList, allList, markersData, isDragging]);

    useImperativeHandle(ref, () => ({
      setCenter: (latLng: Latlng) => {
        const currentComponentId = componentId.current;
        if (globalInitLock || !mapInstance.current || !isMapInitialized.current) {
          console.warn(`[${currentComponentId}] Map is not initialized yet. Cannot set center. Initialized: ${isMapInitialized.current}, Instance: ${!!mapInstance.current}, GlobalLock: ${globalInitLock}`);
          return;
        }
        
        try {
          const newCenter = new window.kakao.maps.LatLng(
            latLng.latitude,
            latLng.longitude,
          );
          mapInstance.current.setCenter(newCenter);
          //console.log(`[${currentComponentId}] Center set to:`, latLng);
        } catch (error) {
          //console.warn(`[${currentComponentId}] Error setting center:`, error);
        }
      },
      getBounds: () => {
        const currentComponentId = componentId.current;
        if (globalInitLock || !mapInstance.current || !isMapInitialized.current) {
          //console.warn(`[${currentComponentId}] Map is not initialized yet. Cannot get bounds. Initialized: ${isMapInitialized.current}, Instance: ${!!mapInstance.current}, GlobalLock: ${globalInitLock}`);
          return null;
        }
        
        try {
          return mapInstance.current.getBounds();
        } catch (error) {
         // console.warn(`[${currentComponentId}] Error getting bounds:`, error);
          return null;
        }
      },
      relayout: () => {
        const currentComponentId = componentId.current;
        if (globalInitLock || !mapInstance.current || !isMapInitialized.current) {
          //console.warn(`[${currentComponentId}] Map is not initialized yet. Cannot relayout. Initialized: ${isMapInitialized.current}, Instance: ${!!mapInstance.current}, Started: ${initializationStarted.current}, GlobalLock: ${globalInitLock}`);
          return;
        }
        
        try {
          mapInstance.current.relayout();
         // console.log(`[${currentComponentId}] Map relayout completed`);
        } catch (error) {
         // console.warn(`[${currentComponentId}] Error during relayout:`, error);
        }
      },
    }));

    return (
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '600px',
          position: 'relative',
          backgroundColor: '#f0f0f0' // 임시 배경색으로 컨테이너 확인
        }}
      ></div>
    );
  },
), (prevProps: any, nextProps: any) => {
  // Custom comparison for memo to prevent unnecessary re-renders
  const prevMarkersString = JSON.stringify(prevProps.markersData?.map((m: any) => ({ id: m.id, isSelected: m.isSelected, isClicked: m.isClicked })));
  const nextMarkersString = JSON.stringify(nextProps.markersData?.map((m: any) => ({ id: m.id, isSelected: m.isSelected, isClicked: m.isClicked })));
  
  return (
    prevProps.location === nextProps.location &&
    prevProps.latY === nextProps.latY &&
    prevProps.longX === nextProps.longX &&
    prevProps.shouldUpdateCenter === nextProps.shouldUpdateCenter &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.companyList.total === nextProps.companyList.total &&
    prevProps.franchiesList.total === nextProps.franchiesList.total &&
    prevProps.allList.total === nextProps.allList.total &&
    prevMarkersString === nextMarkersString
  );
});

KakaoMap.displayName = 'KakaoMap';

export default KakaoMap;
