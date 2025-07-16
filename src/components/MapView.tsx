'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
//import '@styles/franchise/StoreMap.scss';
import {
  getCityCode,
  getLocationCode,
  getFranchiesAll,
} from '@/api/franchise/locationApi';
import {
  CityCodes,
  FranchiseCompany,
  FranchiseCompanyResult,
  LocationCodes,
  AllFranchiseParam,
  AllFranchiseResult,
} from '@/types/apis/franchise/location';
import { GeolocationState } from '@/types/components/franchise/mapGranted';
import KakaoMap from './KakaoMap';
//import CompanyDetailPop from './CompanyDetailPop';
import useGeolocation from '@/hooks/useGeolocation';
import { Latlng } from '@/types/kakaoMap/map';
//import { getDistance } from '@/utils/location';
import { CiSearch } from 'react-icons/ci';
import { MdLocationOn } from "react-icons/md";

interface MapViewProps {
  onDataChange?: (data: AllFranchiseResult) => void;
  markersData?: Array<{
    id: string;
    name: string;
    price: number;
    lat: number;
    lng: number;
    isSelected?: boolean;
    isClicked?: boolean;
  }>;
  onMarkerClick?: (id: string) => void;
}

const MapView = ({ onDataChange, markersData = [], onMarkerClick }: MapViewProps) => {
  const { location: currentLocation, permission } = useGeolocation(); // 현재 위치 값 불러오기

  // eslint-disable-next-line no-unused-vars
  const [city, setCity] = useState<CityCodes>({
    total: 0,
    result: [],
  }); // 시/도
  // eslint-disable-next-line no-unused-vars
  const [selectedCity, setSelectedCity] = useState(''); // 선택된 시/도
  // eslint-disable-next-line no-unused-vars
  const [gu, setGu] = useState<LocationCodes>({
    total: 0,
    result: [],
  }); // 구/군
  // eslint-disable-next-line no-unused-vars
  const [selectedGu, setSelectedGu] = useState(''); // 선택된 구/군
  // eslint-disable-next-line no-unused-vars
  const [keyword, setKeyword] = useState('');
  const [shouldUpdateCenter, setShouldUpdateCenter] = useState(false); // 지도 중심 이동 제어
  const [mapCenter, setMapCenter] = useState<{
    lat: string | number;
    lng: string | number;
  }>({
    lat: '37.5665',
    lng: '126.9780',
  }); // 지도 중심 좌표
  const [isDragging, setIsDragging] = useState(true);

  // const [companyParams, setCompanyParams] = useState<CompanyParams>({
  //   city: '서울',
  //   location: '종로구',
  //   keyword: '',
  //   limit: 10,
  //   offset: 0,
  // }); // 대상 가맹점(전체) 가져올때 파라미터

  // eslint-disable-next-line no-unused-vars
  const [allFranchiseParams, setAllFranchiseParams] =
    useState<AllFranchiseParam>({
      city: '',
      company_name: '',
      geo_lat: '37.5665',
      geo_lng: '126.9780',
      location: '',
      radius: '',
      type: '3',
    });

  const [companyList, setCompanyList] = useState<FranchiseCompanyResult>({
    // 비가맹점 리스트트
    result: [],
    total: '0',
  });
  const [franchiesList, setFranchiesList] = useState<FranchiseCompanyResult>({
    // 가맹점 리스트
    result: [],
    total: '0',
  });
  const [allList, setAllList] = useState<AllFranchiseResult>({
    // 전체 리스트
    result: [],
    total: '0',
  });
  // eslint-disable-next-line no-unused-vars
  const [allListInit, setAllListInit] = useState<AllFranchiseResult>({
    // 전체 데이터 저장 리스트
    result: [],
    total: '0',
  });
  const [allTmpList, setAllTmpList] = useState<AllFranchiseResult>({
    // 전체 데이터 임시 저장 리스트
    result: [],
    total: '0',
  });
  const [selectedCompany, setSelectedCompany] = useState<FranchiseCompany>({
    company_address: '',
    company_city_kr: '',
    company_location_kr: '',
    company_name: '',
    company_tel: '',
    company_type: '',
    geo_lat: '',
    geo_lng: '',
    idx: '',
    id: '',
  });
  const [detailPopShow, setDetailPopShow] = useState(false); // 상세팝업 오픈여부
  /*eslint no-undef: "off"*/
  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [isVisible, setIsVisible] = useState(true); // 라디오 버튼 상태
  // 체크박스 선택 상태
  const [fillters, setFillters] = useState<{
    franchise: boolean;
    no_franchise: boolean;
    nearby: boolean;
  }>({
    franchise: true, // 가맹점 선택
    no_franchise: true, // 비가맹점 선택
    nearby: false, // 내 주변 가맹점 선택
  });
  const mapRef = useRef<any>(null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [geocoder, setGeocoder] = useState<kakao.maps.services.Geocoder | null>(
    null,
  );
  const allListInitRef = useRef<AllFranchiseResult>({ result: [], total: '0' });
  const filltersRef = useRef(fillters);
  const keywordRef = useRef(keyword);

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  // eslint-disable-next-line no-unused-vars
  const [isSupported] = useState<boolean>(
    typeof navigator !== "undefined" && "geolocation" in navigator
  );

  // eslint-disable-next-line no-unused-vars
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 시/도 가져오기
  const getCityCodes = async () => {
    const cityCodes: CityCodes = await getCityCode();
    setCity({
      total: cityCodes.total,
      result: cityCodes.result,
    });
  };

  // 구/군 가져오기
  const getLocationCodes = async (city: string) => {
    const locationCodes: LocationCodes = await getLocationCode(city);
    setGu({
      total: locationCodes.total,
      result: locationCodes.result,
    });
  };

  // 시/도 선택시
  // eslint-disable-next-line no-unused-vars
  const selectCity = async (newCity: string) => {
    let searchCityName = newCity;
    const currentFillters = filltersRef.current;
    
    // "광주" 선택 시 검색은 "광주광역시"로, UI는 "광주"로 유지
    if (newCity === "광주") {
      searchCityName = "광주광역시"; // 검색용
    }

    setSelectedCity(newCity);
    setSelectedGu('');
    getLocationCodes(newCity);
    setAllFranchiseParams((prev) => ({ ...prev, city: newCity }));

    if (newCity === '') {
      setTimeout(() => {
        if (mapRef.current && mapRef.current.getBounds) {
          const bounds = mapRef.current.getBounds();
          const neLatLng = bounds.getNorthEast();
          const swLatLng = bounds.getSouthWest();

          allListInitRef.current = {
            result: allTmpList.result,
            total: allTmpList.total,
          };
          setAllListInit({
            result: allTmpList.result,
            total: allTmpList.total,
          });

          let filteredList = filterLocation(
            { result: allTmpList.result, total: allTmpList.total }, // 직접 전달
            swLatLng?.getLat(),
            swLatLng?.getLng(),
            neLatLng?.getLat(),
            neLatLng?.getLng(),
          );

          if (currentFillters.franchise && !currentFillters.no_franchise) {
            filteredList = filteredList.filter((element) => element.id !== '');
          } else if (
            currentFillters.no_franchise &&
            !currentFillters.franchise
          ) {
            filteredList = filteredList.filter((element) => element.id === '');
          }

          setAllList({
            result: filteredList,
            total: filteredList.length.toString(),
          });
        }
      }, 500);
    } else {
      kakaoAddressSearch(searchCityName).then((res) => {
        setAllFranchiseParams((prev) => ({ ...prev, location: '' }));
        if (res.result === true) {
          setTimeout(() => {
            if (mapRef.current && mapRef.current.getBounds) {
              const bounds = mapRef.current.getBounds();
              const neLatLng = bounds.getNorthEast();
              const swLatLng = bounds.getSouthWest();

              setAllFranchiseParams((prev) => {
                const updatedParams = {
                  ...prev,
                  geo_lat: res.latitude || '37.5665',
                  geo_lng: res.longitude || '126.9780',
                  city: newCity,
                };

                getAllFranchises(updatedParams).then((franchies) => {
                  allListInitRef.current = {
                    result: franchies.result,
                    total: franchies.total,
                  };
                  setAllListInit({
                    result: franchies.result,
                    total: franchies.total,
                  });

                  let filteredList = filterLocation(
                    { result: franchies.result, total: franchies.total }, // 직접 전달
                    swLatLng?.getLat(),
                    swLatLng?.getLng(),
                    neLatLng?.getLat(),
                    neLatLng?.getLng(),
                  );

                  if (
                    currentFillters.franchise &&
                    !currentFillters.no_franchise
                  ) {
                    filteredList = filteredList.filter(
                      (element) => element.id !== '',
                    );
                  } else if (
                    currentFillters.no_franchise &&
                    !currentFillters.franchise
                  ) {
                    filteredList = filteredList.filter(
                      (element) => element.id === '',
                    );
                  }

                  setAllList({
                    result: filteredList,
                    total: filteredList.length.toString(),
                  });
                });

                return updatedParams;
              });
            }
          }, 500);

          moveMapCenter(res.latitude || '37.5665', res.longitude || '126.9780');
        } else {
          // 주소->좌표 변환 실패시 서울 좌표로
          console.error('주소를 좌표로 변환 실패');
          handleCenterChange('37.5665', '126.9780');
          moveMapCenter('37.5665', '126.9780');
        }
      });
    }

    // setShouldUpdateCenter(true); // 지도 중심 이동 활성화
  };

  // 구/군 선택시
  // eslint-disable-next-line no-unused-vars
  const selectGu = (newLocation: string) => {
    const currentFillters = filltersRef.current;

    setSelectedGu(newLocation);
    setAllFranchiseParams((prev) => ({ ...prev, location: newLocation }));

    if (newLocation === '') {
      setTimeout(() => {
        if (mapRef.current && mapRef.current.getBounds) {
          const bounds = mapRef.current.getBounds();
          const neLatLng = bounds.getNorthEast();
          const swLatLng = bounds.getSouthWest();

          setAllFranchiseParams((prev) => {
            const updatedparams = {
              ...prev,
              location: '',
            };

            getAllFranchises(updatedparams).then((franchies) => {
              allListInitRef.current = {
                result: franchies.result,
                total: franchies.total,
              };
              setAllListInit({
                result: franchies.result,
                total: franchies.total,
              });

              let filteredList = filterLocation(
                { result: franchies.result, total: franchies.total }, // 직접 전달
                swLatLng?.getLat(),
                swLatLng?.getLng(),
                neLatLng?.getLat(),
                neLatLng?.getLng(),
              );

              if (currentFillters.franchise && !currentFillters.no_franchise) {
                filteredList = filteredList.filter(
                  (element) => element.id !== '',
                );
              } else if (
                currentFillters.no_franchise &&
                !currentFillters.franchise
              ) {
                filteredList = filteredList.filter(
                  (element) => element.id === '',
                );
              }

              setAllList({
                result: filteredList,
                total: filteredList.length.toString(),
              });
            });

            return updatedparams;
          });
        }
      }, 500);
    } else {
      kakaoAddressSearch(`${selectedCity} ${newLocation}`).then((res) => {
        if (res.result === true) {
          setTimeout(() => {
            if (mapRef.current && mapRef.current.getBounds) {
              const bounds = mapRef.current.getBounds();
              const neLatLng = bounds.getNorthEast();
              const swLatLng = bounds.getSouthWest();

              setAllFranchiseParams((prev) => {
                const updatedParams = {
                  ...prev,
                  geo_lat: res.latitude || '37.5665',
                  geo_lng: res.longitude || '126.9780',
                };

                getAllFranchises(updatedParams).then((franchies) => {
                  allListInitRef.current = {
                    result: franchies.result,
                    total: franchies.total,
                  };
                  setAllListInit({
                    result: franchies.result,
                    total: franchies.total,
                  });

                  let filteredList = filterLocation(
                    { result: franchies.result, total: franchies.total }, // 직접 전달
                    swLatLng?.getLat(),
                    swLatLng?.getLng(),
                    neLatLng?.getLat(),
                    neLatLng?.getLng(),
                  );

                  if (
                    currentFillters.franchise &&
                    !currentFillters.no_franchise
                  ) {
                    filteredList = filteredList.filter(
                      (element) => element.id !== '',
                    );
                  } else if (
                    currentFillters.no_franchise &&
                    !currentFillters.franchise
                  ) {
                    filteredList = filteredList.filter(
                      (element) => element.id === '',
                    );
                  }

                  setAllList({
                    result: filteredList,
                    total: filteredList.length.toString(),
                  });
                });

                return updatedParams;
              });
            }
          }, 500);

          moveMapCenter(res.latitude || '37.5665', res.longitude || '126.9780');
        } else {
          // 주소->좌표 변환 실패시 서울 좌표로
          console.error('주소를 좌표로 변환 실패');
          handleCenterChange('37.5665', '126.9780');
          moveMapCenter('37.5665', '126.9780');
        }
      });
    }

    setShouldUpdateCenter(true); // 지도 중심 이동 활성화
  };

  // 카카오 api 통해 주소->좌표 변환
  const kakaoAddressSearch = (
    address: string,
  ): Promise<{
    result: boolean;
    latitude?: string;
    longitude?: string;
  }> => {
    return new Promise((resolve) => {
      geocoder?.addressSearch(
        address,
        (result: kakao.maps.services.AddressSearchResult[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const latitude = result[0].y;
            const longitude = result[0].x;
            resolve({
              result: true,
              latitude,
              longitude,
            });
          } else {
            resolve({
              result: false,
            });
          }
        },
      );
    });
  };

  // 체크박스 선택 상태 변경하기
  const handleCheckboxHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFillters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 라디오 버튼 상태 변경
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsVisible(e.target.checked);
  };

  // 비가맹점 시/군 기준 리스트 가져오기
  // const getCompanies = (params: CompanyParams) => {
  //   // eslint-disable-next-line no-unused-vars
  //   const companies = getCompany(params).then((res) => {
  //     setCompanyList({
  //       result: res.result,
  //       total: res.total,
  //     });
  //   });
  // };

  // 시/도 구분없이 모든 가맹점/비가맹점 가져오기
  const getAllFranchises = async (params: AllFranchiseParam) => {
    try {
      const res = await getFranchiesAll(params);
      return res;
    } catch (error) {
      console.error('Error in getAllFranchises:', error);
      return { result: [], total: '0' };
    }
  };

  // 가맹점 선택시 팝업띄우기
  const clickCompany = (company: FranchiseCompany) => {
    setSelectedCompany(company);
    setDetailPopShow(true);
  };

  // 상세 팝업 닫기
  const closePop = () => {
    setSelectedCompany({
      company_address: '',
      company_city_kr: '',
      company_location_kr: '',
      company_name: '',
      company_tel: '',
      company_type: '',
      geo_lat: '',
      geo_lng: '',
      idx: '',
      id: '',
    });
    setDetailPopShow(false);
  };

  const handleCenterChange = (
    lat: string,
    lng: string,
    neLatLng?: kakao.maps.LatLng,
    swLatLng?: kakao.maps.LatLng,
    type?: string,
  ) => {
    const currentFillters = filltersRef.current;
    const currentKeyword = keywordRef.current;

    setMapCenter({
      lat: lat,
      lng: lng,
    });

    // 체크박스가 모두 선택되지 않은 경우 빈 리스트 반환
    if (!currentFillters.franchise && !currentFillters.no_franchise) {
      setAllList({
        result: [],
        total: '0',
      });
      setIsDragging(true);
      return;
    }

    if (currentKeyword !== '') {
      setAllFranchiseParams((prev) => {
        const updatedParams = {
          ...prev,
          geo_lat: lat,
          geo_lng: lng,
        };

        getAllFranchises(updatedParams).then((res) => {
          allListInitRef.current = { result: res.result, total: res.total };
          let filteredList = filterLocation(
            { result: res.result, total: res.total },
            swLatLng?.getLat(),
            swLatLng?.getLng(),
            neLatLng?.getLat(),
            neLatLng?.getLng(),
          );

          // 체크박스 상태에 따른 필터링
          if (currentFillters.franchise && !currentFillters.no_franchise) {
            // 가맹점만 선택된 경우
            filteredList = filteredList.filter((element) => element.id !== '');
          } else if (!currentFillters.franchise && currentFillters.no_franchise) {
            // 비가맹점만 선택된 경우
            filteredList = filteredList.filter((element) => element.id === '');
          }
          // 둘 다 선택된 경우는 모든 마커를 표시하므로 추가 필터링 불필요

          setAllList({
            result: filteredList,
            total: filteredList.length.toString(),
          });
        });

        return updatedParams;
      });
    } else {
      if (type === 'init') {
        setAllFranchiseParams((prev) => {
          const updatedParams = {
            ...prev,
            geo_lat: lat,
            geo_lng: lng,
          };

          getAllFranchises(updatedParams).then((res) => {
            allListInitRef.current = { result: res.result, total: res.total };
            setAllListInit({ result: res.result, total: res.total });
            setAllTmpList({ result: res.result, total: res.total });
            let filteredList = filterLocation(
              { result: res.result, total: res.total },
              swLatLng?.getLat(),
              swLatLng?.getLng(),
              neLatLng?.getLat(),
              neLatLng?.getLng(),
            );

            // 체크박스 상태에 따른 필터링
            if (currentFillters.franchise && !currentFillters.no_franchise) {
              // 가맹점만 선택된 경우
              filteredList = filteredList.filter((element) => element.id !== '');
            } else if (!currentFillters.franchise && currentFillters.no_franchise) {
              // 비가맹점만 선택된 경우
              filteredList = filteredList.filter((element) => element.id === '');
            }
            // 둘 다 선택된 경우는 모든 마커를 표시하므로 추가 필터링 불필요

            setAllList({
              result: filteredList,
              total: filteredList.length.toString(),
            });
          });

          return updatedParams;
        });
      } else {
        let filteredList = filterLocation(
          allListInitRef.current,
          swLatLng?.getLat(),
          swLatLng?.getLng(),
          neLatLng?.getLat(),
          neLatLng?.getLng(),
        );

        // 체크박스 상태에 따른 필터링
        if (currentFillters.franchise && !currentFillters.no_franchise) {
          // 가맹점만 선택된 경우
          filteredList = filteredList.filter((element) => element.id !== '');
        } else if (!currentFillters.franchise && currentFillters.no_franchise) {
          // 비가맹점만 선택된 경우
          filteredList = filteredList.filter((element) => element.id === '');
        }
        // 둘 다 선택된 경우는 모든 마커를 표시하므로 추가 필터링 불필요

        setAllList({
          result: filteredList,
          total: filteredList.length.toString(),
        });
      }
    }

    setIsDragging(true);
  };

  // 지도 중심 이동 완료 후 상태 초기화
  const handleCenterUpdated = () => {
    setShouldUpdateCenter(false);
  };

  const handleMapReady = (mapInstance: kakao.maps.Map) => {
    mapRef.current = {
      setCenter: (latLng: Latlng) => {
        if (mapInstance) {
          const newCenter = new window.kakao.maps.LatLng(
            latLng.latitude,
            latLng.longitude,
          );
          mapInstance.setCenter(newCenter);
        }
      },
      getBounds: () => {
        if (mapInstance) {
          return mapInstance.getBounds();
        }
        return null;
      },
      relayout: () => {
        if (mapInstance) {
          mapInstance.relayout();
        }
      },
    };

    // 약간의 지연 후 초기 경계 좌표 가져오기 (지도가 완전히 렌더링된 후)
    setTimeout(() => {
      try {
        const bounds = mapInstance.getBounds();
        if (bounds) {
          const neLatLng = bounds.getNorthEast();
          const swLatLng = bounds.getSouthWest();

          handleCenterChange(
            String(mapCenter.lat),
            String(mapCenter.lng),
            neLatLng,
            swLatLng,
          );
        }
      } catch (error) {
        console.warn('지도 초기화 중 bounds 가져오기 실패:', error);
      }
    }, 200);
  };

  // 가맹점, 비가맹점 리스트 초기화
  const resetList = (type: string) => {
    if (type === 'company') {
      setCompanyList({
        result: [],
        total: '0',
      });
    } else if (type === 'franchise') {
      setFranchiesList({
        result: [],
        total: '0',
      });
    } else if (type === 'all') {
      setAllList({
        result: [],
        total: '',
      });
    }
  };

  // eslint-disable-next-line no-unused-vars
  const moveMapCenter = (lat: string, lng: string) => {
    // 더 엄격한 초기화 체크
    if (mapRef.current && mapRef.current.setCenter && typeof mapRef.current.setCenter === 'function') {
      try {
        mapRef.current.setCenter({
          latitude: Number(lat),
          longitude: Number(lng),
        });
      } catch (error) {
        console.warn('Error setting map center:', error);
      }
    } else {
      console.warn('Map is not ready yet. Center will be set when map initializes.');
      // Don't retry - let the natural map initialization handle this
    }
  };

  const handleZoom = (
    bounds: kakao.maps.LatLng,
    swLatLng: kakao.maps.LatLng,
    neLatLng: kakao.maps.LatLng,
    center: kakao.maps.LatLng,
  ) => {
    const currentFillters = filltersRef.current;

    setMapCenter({
      lat: center.getLat(),
      lng: center.getLng(),
    });

    // 지도 영역 내의 모든 마커 필터링
    let filteredList = filterLocation(
      allListInitRef.current,
      swLatLng?.getLat(),
      swLatLng?.getLng(),
      neLatLng?.getLat(),
      neLatLng?.getLng(),
    );

    // 체크박스 상태에 따른 필터링
    if (currentFillters.franchise && !currentFillters.no_franchise) {
      // 가맹점만 선택된 경우
      filteredList = filteredList.filter((element) => element.id !== '');
    } else if (!currentFillters.franchise && currentFillters.no_franchise) {
      // 비가맹점만 선택된 경우
      filteredList = filteredList.filter((element) => element.id === '');
    } else if (!currentFillters.franchise && !currentFillters.no_franchise) {
      // 둘 다 선택되지 않은 경우
      filteredList = [];
    }
    // 둘 다 선택된 경우는 모든 마커를 표시하므로 추가 필터링 불필요

    setAllList({
      result: filteredList,
      total: filteredList.length.toString(),
    });
  };

  // eslint-disable-next-line no-unused-vars
  // const getMapBounds = (): Promise<kakao.maps.BoundsSwNe> => {
  //   return new Promise((resolve) => {
  //     const checkBoundsReady = () => {
  //       if (mapRef.current && mapRef.current.getBounds) {
  //         resolve(mapRef.current.getBounds());
  //       } else {
  //         setTimeout(checkBoundsReady, 100); // 재시도
  //       }
  //     };
  //     checkBoundsReady();
  //   });
  // };

  // allFranchiseParams의 radius를 지도 대각선의 1/2로
    // eslint-disable-next-line no-unused-vars
  const setRadiusByBounds = async () => {
    /**
      * ha : 지도 좌측 하단 위도
        qa : 지도 좌측 하단 경도
        oa : 지도 우측 상단 위도
        pa : 지도 우측 상단 경도
    */
    //const bounds = await getMapBounds();
    // const distance =
    //   getDistance(bounds.oa, bounds.pa, bounds.ha, bounds.qa) / 2; // 지도 대각선의 반을 반경(radius)으로 사용
    //const accurateRadius = setRadiusAccurate(distance);

    const updatedParams = await new Promise<AllFranchiseParam>((resolve) => {
      setAllFranchiseParams((prev) => {
        const newParams: AllFranchiseParam = {
          ...prev,
          // radius: accurateRadius,
        };
        resolve(newParams); // 상태가 업데이트된 값을 resolve
        return newParams;
      });
    });
    getAllFranchises(updatedParams);
  };

  // const setRadiusAccurate = (distance: number) => {
  //   return Math.ceil(distance * 100) / 100 + 0.3;
  // };

  const filterLocation = (
    allList: AllFranchiseResult,
    swLat?: number,
    swLng?: number,
    neLat?: number,
    neLng?: number,
  ) => {
    if (!swLat || !swLng || !neLat || !neLng) {
      console.warn('Invalid bounds for filtering');
      return [];
    }

    return allList.result.filter((element) => {
      if (!element.geo_lat || !element.geo_lng) return false;

      const lat = parseFloat(element.geo_lat);
      const lng = parseFloat(element.geo_lng);

      // 필터링 조건: 지정된 범위 안의 데이터만 포함
      return lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng;
    });
  };

  const keywordSearch = async (allFranchiseParams: AllFranchiseParam) => {
    const res = await getAllFranchises(allFranchiseParams);
    if (mapRef.current && mapRef.current.getBounds) {
      const bounds = mapRef.current.getBounds();
      const neLatLng = bounds.getNorthEast();
      const swLatLng = bounds.getSouthWest();
      const filteredList = filterLocation(
        { result: res.result, total: res.total },
        swLatLng?.getLat(),
        swLatLng?.getLng(),
        neLatLng?.getLat(),
        neLatLng?.getLng(),
      );
      setAllList({
        result: filteredList,
        total: filteredList.length.toString(),
      });
    }
  };

  // 위치 권한 요청
  const requestPermission = () => {
    if(!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: '위치 정보를 사용할 수 없습니다.',
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) =>{
        setIsPermissionGranted(true);
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
        });
      },
      (error) => {
        setIsPermissionGranted(false);
        setLocation((prev) => ({
          ...prev,
          error: error.message,
        }));
      }
    );
  }

  const handleCurrentLocation = async () => {
    if (currentLocation) {
      // 시/도, 구/군 선택 초기화
      setSelectedCity('');
      setSelectedGu('');
      
      // 지도 중심을 현재 위치로 이동
      if (mapRef.current && mapRef.current.setCenter) {
        mapRef.current.setCenter({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });

        // 지도 중심 좌표 업데이트
        setMapCenter({
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        });

        // 현재 위치 기준으로 가맹점 데이터 가져오기
        const updatedParams = {
          ...allFranchiseParams,
          city: '',  // 시/도 초기화
          location: '',  // 구/군 초기화
          geo_lat: String(currentLocation.latitude),
          geo_lng: String(currentLocation.longitude),
          type: '3', // 주변 가맹점 검색 타입
        };

        setAllFranchiseParams(updatedParams);

        // 가맹점 데이터 가져오기
        const franchiseData = await getAllFranchises(updatedParams);
        
        if (mapRef.current && mapRef.current.getBounds) {
          const bounds = mapRef.current.getBounds();
          const neLatLng = bounds.getNorthEast();
          const swLatLng = bounds.getSouthWest();

          // 현재 지도 영역 내의 가맹점만 필터링
          let filteredList = filterLocation(
            franchiseData,
            swLatLng?.getLat(),
            swLatLng?.getLng(),
            neLatLng?.getLat(),
            neLatLng?.getLng(),
          );

          // 체크박스 상태에 따른 필터링
          if (fillters.franchise && !fillters.no_franchise) {
            // 가맹점만 선택된 경우
            filteredList = filteredList.filter((element) => element.id !== '');
          } else if (!fillters.franchise && fillters.no_franchise) {
            // 비가맹점만 선택된 경우
            filteredList = filteredList.filter((element) => element.id === '');
          } else if (!fillters.franchise && !fillters.no_franchise) {
            // 둘 다 선택되지 않은 경우
            filteredList = [];
          }
          // 둘 다 선택된 경우는 모든 마커를 표시하므로 추가 필터링 불필요

          // 필터링된 가맹점 리스트 업데이트
          setAllList({
            result: filteredList,
            total: filteredList.length.toString(),
          });
          
          // 전체 리스트도 업데이트
          setAllListInit(franchiseData);
          allListInitRef.current = franchiseData;
        }
      }
    }
  };

  function isMobileDevice(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  //브라우저 감지 함수
  function getBrowserName(): string {
    const userAgent = navigator.userAgent;
  
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg") && !userAgent.includes("OPR")) {
      return "Chrome";
    } else if (userAgent.includes("Edg")) {
      return "Edge";
    } else if (userAgent.includes("Firefox")) {
      return "Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      return "Safari";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
      return "Opera";
    } else {
      return "Unknown";
    }
  }



  // 현재 위치 주변 가맹점 검색 버튼 클릭 시 실행
  const handleNearbyBtn = () => {
    requestPermission();
    // 현재 위치 정보가 있고 위치 권한이 허용된 경우에만 실행
    if (permission === 'granted') {
        handleCurrentLocation();
    } else if (permission === 'prompt' && typeof requestPermission === 'function') {
      requestPermission();
      handleCurrentLocation();
    } else if (permission === 'denied') {     

      if(isMobileDevice()){
        const goToSettings = confirm(
          "위치 정보 접근이 차단되어 있어 주변 가맹점을 검색할 수 없습니다.\n브라우저 설정에서 권한을 허용해주세요.\n\n설정 화면으로 이동하시겠습니까?"
        );

        if (goToSettings) {
          console.log(navigator.userAgent);
          const browser = getBrowserName();

          switch (browser) {
            case "Desktop":
              window.open('chrome://settings/');
              break;
            case "Chrome":
              window.open('chrome://settings/content/location');
              break;
            case "Edge":
              window.open('edge://settings/content/location'); 
              break;
            case "Firefox":
              window.open('about:preferences#privacy');
              break;
            case "Safari":
              window.open('safari-preferences:content/location');
              break;
            case "Opera":
              window.open('opera://settings/content/location');
              break;
            default:
              alert("브라우저를 인식할 수 없습니다. 위치 권한은 브라우저 설정에서 수동으로 변경해주세요.");
          }
        }
      }
      else{
        setShowSettingsModal(true);
      } 
    } else if (!currentLocation) {
      alert("현재 위치를 확인할 수 없습니다. 다시 시도해주세요.");
    } else {
      alert("위치 정보를 사용할 수 없습니다.");
    }
  };

  // 현재 위치 정보를 저장하는 useEffect 추가
  useEffect(() => {
    if (currentLocation && permission === 'granted') {
      localStorage.setItem('lastLocation', JSON.stringify({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        permission: permission
      }));
    }
  }, [currentLocation, permission]);


  useEffect(() => {
    const initializeMap = async () => {
      getCityCodes();

      window.kakao.maps.load(async () => {
        setGeocoder(new window.kakao.maps.services.Geocoder());
        
        // localStorage에서 마지막 위치 정보 가져오기
        const lastLocationStr = localStorage.getItem('lastLocation');
        const lastLocation = lastLocationStr ? JSON.parse(lastLocationStr) : null;
        
        if (lastLocation && lastLocation.permission === 'granted') {
          // 마지막 저장된 위치 정보로 지도 중심 설정
          setMapCenter({
            lat: lastLocation.latitude,
            lng: lastLocation.longitude,
          });

          // 현재 위치 기준으로 가맹점 데이터 새로 불러오기
          const updatedParams = {
            ...allFranchiseParams,
            geo_lat: String(lastLocation.latitude),
            geo_lng: String(lastLocation.longitude),
            city: '',  // 시/도 초기화
            location: '',  // 구/군 초기화
            type: '3', // 주변 가맹점 검색 타입
          };

          setAllFranchiseParams(updatedParams);

          // 지도가 준비되면 중심을 이동하고 데이터를 가져옴
          setTimeout(async () => {
            if (mapRef.current && mapRef.current.setCenter) {
              mapRef.current.setCenter({
                latitude: lastLocation.latitude,
                longitude: lastLocation.longitude,
              });
            }

            // 가맹점 데이터 가져오기
            const franchiseData = await getAllFranchises(updatedParams);
            
            setTimeout(() => {
              if (mapRef.current && mapRef.current.getBounds) {
                try {
                  const bounds = mapRef.current.getBounds();
                  if (bounds) {
                    const neLatLng = bounds.getNorthEast();
                    const swLatLng = bounds.getSouthWest();

                    const filteredList = filterLocation(
                      franchiseData,
                      swLatLng?.getLat(),
                      swLatLng?.getLng(),
                      neLatLng?.getLat(),
                      neLatLng?.getLng(),
                    );

                    // 필터링된 가맹점 리스트 업데이트
                    setAllList({
                      result: filteredList,
                      total: filteredList.length.toString(),
                    });
                    
                    // 전체 리스트도 업데이트
                    setAllListInit(franchiseData);
                    allListInitRef.current = franchiseData;
                  }
                } catch (error) {
                  console.warn('지도 bounds 처리 중 오류:', error);
                }
              }
            }, 300);
          }, 500);
        } else if (permission === 'granted' && currentLocation) {
          // 기존 현재 위치 기반 초기화 로직 유지
          // ... 기존 코드 ...
        } else {
          // 위치 권한이 없거나 현재 위치를 가져올 수 없는 경우
          // 기본 서울 좌표로 초기화 - handleMapReady에서 처리됨
        }
      });
    };
    initializeMap();
  }, [permission, currentLocation]);

  //체크박스 상태에 따라 데이터 가져오기
  useEffect(() => {
    filltersRef.current = fillters;

    if (isInitialRender) {
      setIsInitialRender(false); // 이후로는 실행되지 않음
      return;
    }

    if (fillters.franchise && fillters.no_franchise) {
      // 가맹점, 비가맹점 모두 선택
      if (mapRef.current && mapRef.current.getBounds) {
        const bounds = mapRef.current.getBounds();
        const neLatLng = bounds.getNorthEast();
        const swLatLng = bounds.getSouthWest();

        handleCenterChange(
          String(mapCenter.lat),
          String(mapCenter.lng),
          neLatLng,
          swLatLng,
          'fillters_all',
        );
      }
    } else if (fillters.franchise && !fillters.no_franchise) {
      // 가맹점만 선택
      if (mapRef.current && mapRef.current.getBounds) {
        const bounds = mapRef.current.getBounds();
        const neLatLng = bounds.getNorthEast();
        const swLatLng = bounds.getSouthWest();

        handleCenterChange(
          String(mapCenter.lat),
          String(mapCenter.lng),
          neLatLng,
          swLatLng,
          'fillters_franchise',
        );
      }
    } else if (!fillters.franchise && fillters.no_franchise) {
      // 비가맹점만 선택
      if (mapRef.current && mapRef.current.getBounds) {
        const bounds = mapRef.current.getBounds();
        const neLatLng = bounds.getNorthEast();
        const swLatLng = bounds.getSouthWest();

        handleCenterChange(
          String(mapCenter.lat),
          String(mapCenter.lng),
          neLatLng,
          swLatLng,
          'fillters_no_franchise',
        );
      }
    } else {
      // 가맹점, 비가맹점 둘다 선택 안됨
      resetList('company');
      resetList('franchise');
      resetList('all');
    }
  }, [fillters]);

  useEffect(() => {
    keywordRef.current = keyword;
  }, [keyword]);

  // API 데이터 변경 시 상위 컴포넌트에 전달
  useEffect(() => {
    if (onDataChange) {
      onDataChange(allList);
    }
  }, [allList, onDataChange]);

  useEffect(() => {
    const mapElement = document.getElementById('map'); // #map 요소 가져오기
    
    if (!mapElement) {
      console.warn('맵 요소를 찾을 수 없습니다.');
      return;
    }
  
        // ResizeObserver 생성
    const observer = new ResizeObserver(() => {
      // 지도가 완전히 초기화되었는지 확인 (map 인스턴스가 있고 bounds를 가져올 수 있는지)
      if (mapRef.current?.relayout && mapRef.current?.getBounds && 
          typeof mapRef.current.relayout === 'function' && 
          typeof mapRef.current.getBounds === 'function') {
        // 지도 relayout 먼저 실행
        try {
          mapRef.current.relayout();
          console.log('ResizeObserver: Map relayout completed');
        } catch (error) {
          console.warn('ResizeObserver: Error during relayout:', error);
          return; // Exit early if relayout fails
        }
        
        // 약간의 지연 후 bounds 처리 (relayout이 완료된 후)
        setTimeout(() => {
          if (mapRef.current?.getBounds && typeof mapRef.current.getBounds === 'function') {
            const currentFillters = filltersRef.current;
            
            try {
              const bounds = mapRef.current.getBounds();

              // bounds가 올바른 값인지 확인
              if (bounds && bounds.getNorthEast && bounds.getSouthWest && 
                  typeof bounds.getNorthEast === 'function' && typeof bounds.getSouthWest === 'function') {
                const neLatLng = bounds.getNorthEast();
                const swLatLng = bounds.getSouthWest();

                let filteredList = filterLocation(
                  allListInitRef.current,
                  swLatLng?.getLat(),
                  swLatLng?.getLng(),
                  neLatLng?.getLat(),
                  neLatLng?.getLng(),
                );

                if (currentFillters.franchise && !currentFillters.no_franchise) {
                  filteredList = filteredList.filter((element) => element.id !== '');
                } else if (currentFillters.no_franchise && !currentFillters.franchise) {
                  filteredList = filteredList.filter((element) => element.id === '');
                }

                setAllList({
                  result: filteredList,
                  total: filteredList.length.toString(),
                });
                console.log('ResizeObserver: Filtered list updated with', filteredList.length, 'items');
              } else {
                console.warn('ResizeObserver: Invalid bounds returned');
              }
            } catch (error) {
              console.warn('ResizeObserver: 지도 bounds 처리 중 오류:', error);
            }
          } else {
            console.warn('ResizeObserver: getBounds method not available after delay');
          }
        }, 250); // Increased delay to 250ms to wait for map initialization
      } else {
        // Throttle the "not ready" logs to avoid spam
        if (Math.random() < 0.1) { // Only log 10% of the time
          console.log('ResizeObserver: Map not ready for resize handling. Will retry when map is ready.');
        }
      }
    });
  
    observer.observe(mapElement); // #map 요소 관찰 시작
  
    // 컴포넌트가 언마운트될 때 observer 정리
    return () => {
      observer.disconnect(); // 관찰 중단
    };
  }, []);
  

  return (
    <div className="StoreMap w-full h-full" style={{ minHeight: '600px', height: '100%' }}>
      <div id="map" className="w-full h-full" style={{ minHeight: '600px', height: '100%' }}>
        <KakaoMap
          ref={mapRef}
          onMapReady={handleMapReady}
          location=""
          latY={mapCenter.lat}
          longX={mapCenter.lng}
          companyList={companyList}
          markerClick={clickCompany}
          franchiesList={franchiesList}
          allList={allList}
          markersData={markersData}
          onMarkerClick={onMarkerClick}
          onCenterChange={handleCenterChange}
          shouldUpdateCenter={shouldUpdateCenter}
          onCenterUpdated={handleCenterUpdated}
          isDragging={isDragging}
          onZoomChange={handleZoom}
        />
      </div>
    </div>
  );
};

export default MapView;

