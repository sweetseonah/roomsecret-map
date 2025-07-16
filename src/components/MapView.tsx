'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Maximize2, Minimize2, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MapMarker {
  id: string;
  name: string;
  price: number;
  lat: number;
  lng: number;
  isSelected?: boolean;
}

interface MapViewProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile?: boolean;
  selectedMotelId?: string | null;
}

export function MapView({ 
  markers, 
  onMarkerClick, 
  isExpanded, 
  onToggleExpand, 
  isMobile,
  selectedMotelId 
}: MapViewProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const mapHeight = isMobile ? 'h-full' : isExpanded ? 'h-screen' : 'h-screen';

  // 클라이언트 마운트 감지
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || !window.kakao || !window.kakao.maps) return;

    // 카카오 지도 API가 완전히 로드된 후 지도 초기화
    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      // 카카오 지도 초기화
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표
        level: 5
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      mapInstanceRef.current = map;

      // 기존 마커들 제거
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // 새 마커들 추가
      markers.forEach((markerData) => {
        const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng);
        
        // 커스텀 오버레이 생성
        const content = `
          <div class="custom-marker ${markerData.id === selectedMotelId ? 'selected' : ''}" 
               style="position: relative; cursor: pointer;">
            <div style="
              background: ${markerData.id === selectedMotelId ? '#3b82f6' : 'white'};
              color: ${markerData.id === selectedMotelId ? 'white' : '#374151'};
              padding: 4px 8px;
              border-radius: 9999px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid ${markerData.id === selectedMotelId ? '#2563eb' : '#d1d5db'};
              font-size: 12px;
              font-weight: 600;
              white-space: nowrap;
              transform: ${markerData.id === selectedMotelId ? 'scale(1.1)' : 'scale(1)'};
              transition: all 0.2s ease;
            ">
              ₩${(markerData.price / 1000).toFixed(0)}k
            </div>
            <div style="
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-top: 6px solid ${markerData.id === selectedMotelId ? '#3b82f6' : 'white'};
            "></div>
          </div>
        `;

        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: position,
          content: content,
          yAnchor: 1
        });

        customOverlay.setMap(map);
        markersRef.current.push(customOverlay);

        // 클릭 이벤트 추가
        const overlayElement = customOverlay.getContent();
        if (overlayElement) {
          overlayElement.addEventListener('click', () => {
            onMarkerClick(markerData.id);
          });
        }
      });

      // 마커들이 모두 보이도록 지도 범위 조정
      if (markers.length > 0) {
        const bounds = new window.kakao.maps.LatLngBounds();
        markers.forEach(marker => {
          bounds.extend(new window.kakao.maps.LatLng(marker.lat, marker.lng));
        });
        map.setBounds(bounds);
      }
    });
  }, [markers, selectedMotelId, onMarkerClick]);

  return (
    <Card className={`relative transition-all duration-300 ${mapHeight}`}>
      {/* 실제 카카오 지도 */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: '300px' }}
      />
      
      {/* 지도 로딩 중일 때 표시할 플레이스홀더 */}
      {(!isClient || !window.kakao || !window.kakao.maps) && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-primary-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-secondary-500">
            <MapPin className="h-8 sm:h-12 w-8 sm:w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">지도를 로딩 중입니다...</p>
          </div>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (isClient && navigator.geolocation && mapInstanceRef.current && window.kakao && window.kakao.maps) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const lat = position.coords.latitude;
                  const lng = position.coords.longitude;
                  const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
                  mapInstanceRef.current.setCenter(moveLatLng);
                  mapInstanceRef.current.setLevel(3);
                },
                (error) => {
                  alert('현재 위치를 가져올 수 없습니다.');
                }
              );
            } else {
              alert('지도가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.');
            }
          }}
          className="bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary-50 hover:text-primary-600"
        >
          <Navigation className="h-4 w-4" />
        </Button>
        
        {/* {onToggleExpand && !isMobile && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleExpand}
            className="bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary-50 hover:text-primary-600"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )} */}
      </div>

      {/* Results count - 모바일에서는 숨김 */}
      {!isMobile && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2">
          <Button className="bg-secondary-700 hover:bg-secondary-800 text-white shadow-lg text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10">
            이 지역 검색 결과 {markers.length}개
          </Button>
        </div>
      )}
    </Card>
  );
}