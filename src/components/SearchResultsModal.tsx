import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Train, Camera, Building, Star, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  searchType: 'subway' | 'attraction' | 'area' | 'hotel';
  onMotelSelect: (motelId: string) => void;
}

// 근처 숙소 모의 데이터 (실제로는 검색 API에서 가져올 데이터)
const nearbyAccommodations = {
  '왕제역': [
    {
      id: 'nearby-1',
      name: '왕제역 비즈니스 호텔',
      distance: '도보 3분 (200m)',
      rating: 4.5,
      reviewCount: 128,
      price: 89000,
      originalPrice: 125000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식'],
      priceType: '1박',
      isTimeSale: true,
      tags: ['역 근처', '비즈니스']
    },
    {
      id: 'nearby-2', 
      name: '왕제 대명 호텔',
      distance: '도보 5분 (350m)',
      rating: 4.3,
      reviewCount: 89,
      price: 75000,
      originalPrice: 95000,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '24시간'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['모텔', '저렴']
    },
    {
      id: 'nearby-3',
      name: '왕제 30Month Hotel',
      distance: '도보 7분 (450m)',
      rating: 4.2,
      reviewCount: 156,
      price: 68000,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '커플룸'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['모텔', '커플']
    }
  ],
  '강남역': [
    {
      id: 'nearby-4',
      name: '강남 프리미엄 호텔',
      distance: '도보 2분 (150m)',
      rating: 4.7,
      reviewCount: 234,
      price: 145000,
      originalPrice: 180000,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식', '헬스장'],
      priceType: '1박',
      isTimeSale: true,
      tags: ['프리미엄', '역 근처']
    },
    {
      id: 'nearby-5',
      name: '강남 비즈니스 호텔',
      distance: '도보 4분 (250m)',
      rating: 4.4,
      reviewCount: 178,
      price: 98000,
      originalPrice: 120000,
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['비즈니스', '깨끗']
    }
  ],
  '홍대입구역': [
    {
      id: 'nearby-6',
      name: '홍대 게스트하우스',
      distance: '도보 5분 (300m)',
      rating: 4.6,
      reviewCount: 98,
      price: 35000,
      originalPrice: 45000,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '공용주방', '라운지'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['게스트하우스', '젊은층']
    },
    {
      id: 'nearby-7',
      name: '홍대 부티크 호텔',
      distance: '도보 8분 (500m)',
      rating: 4.5,
      reviewCount: 167,
      price: 125000,
      originalPrice: 155000,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식', '디자인'],
      priceType: '1박',
      isTimeSale: true,
      tags: ['부티크', '디자인']
    }
  ],
  '경복궁': [
    {
      id: 'nearby-8',
      name: '경복궁 한옥 게스트하우스',
      distance: '도보 3분 (200m)',
      rating: 4.8,
      reviewCount: 95,
      price: 55000,
      originalPrice: 70000,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '전통차', '문화체험'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['한옥', '전통', '문화']
    },
    {
      id: 'nearby-9',
      name: '북촌 프리미엄 호텔',
      distance: '도보 8분 (600m)',
      rating: 4.6,
      reviewCount: 167,
      price: 125000,
      originalPrice: 155000,
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식', '한옥뷰'],
      priceType: '1박',
      isTimeSale: true,
      tags: ['프리미엄', '한옥뷰']
    }
  ],
  '서면역': [
    {
      id: 'nearby-10',
      name: '서면 비즈니스 호텔',
      distance: '도보 2분 (100m)',
      rating: 4.4,
      reviewCount: 156,
      price: 78000,
      originalPrice: 95000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['역 근처', '비즈니스']
    },
    {
      id: 'nearby-11',
      name: '서면 프리미엄 모텔',
      distance: '도보 4분 (250m)',
      rating: 4.2,
      reviewCount: 89,
      price: 65000,
      originalPrice: 80000,
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '24시간'],
      priceType: '1박',
      isTimeSale: true,
      tags: ['모텔', '깨끗']
    }
  ],
  '반월당역': [
    {
      id: 'nearby-12',
      name: '반월당 호텔',
      distance: '도보 3분 (200m)',
      rating: 4.3,
      reviewCount: 124,
      price: 72000,
      originalPrice: 90000,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      amenities: ['Wi-Fi', '주차', '조식'],
      priceType: '1박',
      isTimeSale: false,
      tags: ['역 근처', '편리']
    }
  ]
};

export function SearchResultsModal({ 
  isOpen, 
  onClose, 
  searchQuery, 
  searchType,
  onMotelSelect 
}: SearchResultsModalProps) {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && searchQuery) {
      setLoading(true);
      // 실제로는 API 호출, 여기서는 mock 데이터 사용
      setTimeout(() => {
        const results = nearbyAccommodations[searchQuery as keyof typeof nearbyAccommodations] || [];
        setAccommodations(results);
        setLoading(false);
      }, 800);
    }
  }, [isOpen, searchQuery]);

  const getSearchTypeIcon = () => {
    switch (searchType) {
      case 'subway': return Train;
      case 'attraction': return Camera;
      case 'area': return MapPin;
      case 'hotel': return Building;
      default: return MapPin;
    }
  };

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case 'subway': return '지하철역';
      case 'attraction': return '관광지';
      case 'area': return '지역';
      case 'hotel': return '숙소';
      default: return '';
    }
  };

  const getSearchDescription = () => {
    switch (searchType) {
      case 'subway': return `${searchQuery}에서 가까운 숙소들입니다`;
      case 'attraction': return `${searchQuery} 주변 관광하기 좋은 숙소들입니다`;
      case 'area': return `${searchQuery} 지역의 추천 숙소들입니다`;
      default: return `${searchQuery} 검색 결과입니다`;
    }
  };

  const handleAccommodationClick = (accommodation: any) => {
    onMotelSelect(accommodation.id);
    onClose();
  };

  const SearchTypeIcon = getSearchTypeIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <SearchTypeIcon className="h-5 w-5 text-primary-600" />
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                {searchQuery}
              </DialogTitle>
              <Badge variant="outline" className="text-xs">
                {getSearchTypeLabel()}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {getSearchDescription()} · 총 {accommodations.length}개 숙소
          </p>
        </DialogHeader>

        {/* Results */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-140px)]">
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600">검색 중...</span>
              </div>
            ) : accommodations.length > 0 ? (
              <div className="space-y-4">
                {/* Search Tips for Subway Stations */}
                {searchType === 'subway' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Train className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">지하철역 주변 숙소 안내</h4>
                        <p className="text-sm text-blue-700">
                          {searchQuery}에서 도보로 접근 가능한 숙소들을 거리순으로 정렬했습니다. 
                          대중교통 이용이 편리한 위치의 숙소들입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {accommodations.map((accommodation) => (
                  <Card
                    key={accommodation.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-primary-300"
                    onClick={() => handleAccommodationClick(accommodation)}
                  >
                    <div className="flex space-x-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={accommodation.image}
                          alt={accommodation.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {accommodation.name}
                            </h3>
                            
                            {/* Distance */}
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{accommodation.distance}</span>
                              {searchType === 'subway' && (
                                <span className="text-blue-600 font-medium">
                                  · 지하철 이용 편리
                                </span>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center space-x-1 mb-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{accommodation.rating}</span>
                              <span className="text-sm text-gray-500">
                                ({accommodation.reviewCount}개 후기)
                              </span>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1 mb-2">
                              {accommodation.amenities.map((amenity: string) => (
                                <Badge
                                  key={amenity}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {amenity}
                                </Badge>
                              ))}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1">
                              {accommodation.tags.map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right ml-4">
                            {accommodation.isTimeSale && (
                              <Badge className="bg-red-600 text-white mb-1 text-xs">
                                특가
                              </Badge>
                            )}
                            {accommodation.originalPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                ₩{accommodation.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="text-lg font-bold text-gray-900">
                              ₩{accommodation.price.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {accommodation.priceType}
                            </div>
                            {accommodation.originalPrice && (
                              <div className="text-xs text-green-600 font-medium mt-1">
                                {Math.round((1 - accommodation.price / accommodation.originalPrice) * 100)}% 할인
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {searchType === 'subway' ? '지하철 이용 팁' : '검색 팁'}
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {searchType === 'subway' ? (
                      <>
                        <li>• 첫차/막차 시간을 확인하여 일정을 계획하세요</li>
                        <li>• 출입구 번호를 미리 확인하면 더 빠르게 찾을 수 있습니다</li>
                        <li>• 환승역의 경우 여러 노선 이용이 가능합니다</li>
                      </>
                    ) : (
                      <>
                        <li>• 예약 전 숙소 위치와 교통편을 확인하세요</li>
                        <li>• 리뷰를 참고하여 더 나은 선택을 하세요</li>
                        <li>• 취소 정책을 미리 확인하시기 바랍니다</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchTypeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600">
                  {searchQuery} 주변에 등록된 숙소가 없습니다.
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="mt-4"
                >
                  다른 지역 검색하기
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}