import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Search, Building, Home, TreePine, Waves, Mountain, Hotel, Tent, MapPin, Train, Camera, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { SearchResultsModal } from './SearchResultsModal';
import { SubwayMapModal } from './SubwayMapModal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMotelSelect?: (motelId: string) => void;
}

// 검색 데이터베이스 - 실제 구현시 API에서 가져올 데이터
const searchDatabase = [
  // 지하철역 데이터
  { id: 'subway-1', type: 'subway', name: '왕제역', subName: '서초구정', location: '서울특별시 서초구', icon: Train },
  { id: 'subway-2', type: 'subway', name: '왕제시민의숲역', subName: '매점', location: '서울특별시 서초구', icon: Train },
  { id: 'subway-3', type: 'subway', name: '강남역', subName: '2호선', location: '서울특별시 강남구', icon: Train },
  { id: 'subway-4', type: 'subway', name: '홍대입구역', subName: '2호선', location: '서울특별시 마포구', icon: Train },
  { id: 'subway-5', type: 'subway', name: '명동역', subName: '4호선', location: '서울특별시 중구', icon: Train },
  { id: 'subway-6', type: 'subway', name: '여의도역', subName: '5호선', location: '서울특별시 영등포구', icon: Train },
  { id: 'subway-7', type: 'subway', name: '송파역', subName: '8호선', location: '서울특별시 송파구', icon: Train },

  // 호텔/숙소 데이터
  { id: 'hotel-1', type: 'hotel', name: '왕제 대명 호텔', subName: '모텔', location: '서울 서초구', icon: Hotel },
  { id: 'hotel-2', type: 'hotel', name: '왕제 30Month Hotel', subName: '모텔', location: '서울 서초구', icon: Hotel },
  { id: 'hotel-3', type: 'hotel', name: '신화관 제주신화월드', subName: '5성급 호텔', location: '제주도 서귀포시', icon: Building },
  { id: 'hotel-4', type: 'hotel', name: '강남 비즈니스 호텔', subName: '비즈니스 호텔', location: '서울 강남구', icon: Building },
  { id: 'hotel-5', type: 'hotel', name: '홍대 게스트하우스', subName: '게스트하우스', location: '서울 마포구', icon: Home },
  { id: 'hotel-6', type: 'hotel', name: '명동 프리미엄 호텔', subName: '프리미엄 호텔', location: '서울 중구', icon: Building },

  // 관광지 데이터
  { id: 'attraction-1', type: 'attraction', name: '왕제전 생태공원', subName: '공원', location: '서울 서초구', icon: TreePine },
  { id: 'attraction-2', type: 'attraction', name: '왕제 아트 살롱', subName: '미술관', location: '서울 서초구', icon: Camera },
  { id: 'attraction-3', type: 'attraction', name: '한강공원', subName: '공원', location: '서울 여의도', icon: Waves },
  { id: 'attraction-4', type: 'attraction', name: '경복궁', subName: '궁궐', location: '서울 종로구', icon: Mountain },
  { id: 'attraction-5', type: 'attraction', name: '남산타워', subName: '전망대', location: '서울 중구', icon: Mountain },
  { id: 'attraction-6', type: 'attraction', name: '롯데월드', subName: '테마파크', location: '서울 송파구', icon: Star },

  // 지역명 데이터
  { id: 'area-1', type: 'area', name: '왕제동', subName: '서초구', location: '서울특별시 서초구', icon: MapPin },
  { id: 'area-2', type: 'area', name: '강남구', subName: '서울', location: '서울특별시 강남구', icon: MapPin },
  { id: 'area-3', type: 'area', name: '홍대', subName: '마포구', location: '서울특별시 마포구', icon: MapPin },
  { id: 'area-4', type: 'area', name: '명동', subName: '중구', location: '서울특별시 중구', icon: MapPin },
  { id: 'area-5', type: 'area', name: '제주도', subName: '제주특별자치도', location: '제주특별자치도', icon: MapPin },
  { id: 'area-6', type: 'area', name: '부산', subName: '부산광역시', location: '부산광역시', icon: MapPin },
];

const accommodationTypes = [
  {
    id: 'business',
    icon: Building,
    name: '비즈니스 호텔',
    description: '시내 중심가 위치의 비즈니스 호텔',
    color: 'text-primary-600'
  },
  {
    id: 'unique',
    icon: Home,
    name: '독특한 숙소',
    description: '독특한 거주지나 특별한 경험을 제공하는 숙소',
    color: 'text-accent-600'
  },
  {
    id: 'villa',
    icon: Hotel,
    name: '빌라/펜션',
    description: '독립적인 입구가 있는 빌라나 펜션',
    color: 'text-success-600'
  },
  {
    id: 'glamping',
    icon: Tent,
    name: '캠핑/글램핑',
    description: '캠핑장이나 자연 속에서 즐기는 특별한 숙박',
    color: 'text-emerald-600'
  },
  {
    id: 'guesthouse',
    icon: Home,
    name: '게스트하우스',
    description: '개인 민박이나 게스트하우스',
    color: 'text-blue-600'
  },
  {
    id: 'resort',
    icon: Waves,
    name: '리조트',
    description: '리조트나 휴양지에서 제공하는 숙박 시설',
    color: 'text-cyan-600'
  },
  {
    id: 'motel',
    icon: Mountain,
    name: '모텔',
    description: '모텔이나 개인 사업자가 운영하는 숙박업소',
    color: 'text-purple-600'
  }
];

export function SearchModal({ isOpen, onClose, onMotelSelect }: SearchModalProps) {
  const [activeTab, setActiveTab] = useState('accommodation');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSearchItem, setSelectedSearchItem] = useState<any>(null);
  const [showSubwayMap, setShowSubwayMap] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 검색 기능
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 1) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // 검색 결과 필터링
    const filtered = searchDatabase.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.subName.toLowerCase().includes(query.toLowerCase()) ||
      item.location.toLowerCase().includes(query.toLowerCase())
    );

    // 검색 결과 정렬 (정확한 매치 우선)
    const sorted = filtered.sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      const bExact = b.name.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      return bExact - aExact;
    });

    setSearchResults(sorted.slice(0, 10)); // 최대 10개 결과만 표시
    setShowResults(true);
  };

  // 검색 결과 선택 처리
  const handleSearchResultClick = (item: any) => {
    setSearchQuery(item.name);
    setShowResults(false);
    setSelectedSearchItem(item);
    
    // 선택된 항목에 따라 근처 숙소 검색 결과 모달 표시
    if (item.type === 'subway' || item.type === 'attraction' || item.type === 'area') {
      setShowSearchResults(true);
    } else if (item.type === 'hotel' && onMotelSelect) {
      // 호텔 직접 선택시 상세페이지로 이동
      onMotelSelect(item.id);
      onClose();
    }
  };

  // 지하철 노선도에서 역 선택 처리
  const handleStationSelect = (station: any) => {
    const stationItem = {
      id: `station-${station.id}`,
      type: 'subway',
      name: station.name,
      subName: station.line,
      location: station.line
    };
    
    setSelectedSearchItem(stationItem);
    setShowSearchResults(true);
    setShowSubwayMap(false);
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subway': return Train;
      case 'hotel': return Hotel;
      case 'attraction': return Camera;
      case 'area': return MapPin;
      default: return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subway': return 'text-blue-600';
      case 'hotel': return 'text-purple-600';
      case 'attraction': return 'text-green-600';
      case 'area': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'subway': return '지하철역';
      case 'hotel': return '숙소';
      case 'attraction': return '관광지';
      case 'area': return '지역';
      default: return '';
    }
  };

  const tabs = [
    { id: 'accommodation', label: '숙소명', icon: Search },
    { id: 'checkin', label: '체크인', icon: Calendar },
    { id: 'checkout', label: '체크아웃', icon: Calendar },
    { id: 'who', label: '여행자', icon: Users }
  ];

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-full max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header - Fixed at top */}
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            숙소 검색
          </DialogTitle>
          <DialogDescription className="text-sm text-secondary-600 mt-1">
            지역, 지하철역, 모텔명, 관광지로 검색하여 완벽한 숙박을 찾아보세요
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="pb-6">
            {/* Search Tabs */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <div
                      key={tab.id}
                      className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all relative ${
                        activeTab === tab.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base">{tab.label}</span>
                      </div>
                      
                      {tab.id === 'accommodation' && (
                        <div className="relative">
                          <Input
                            ref={searchInputRef}
                            placeholder="지역, 지하철역, 모텔명"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="border-none p-0 focus-visible:ring-0 text-sm h-auto bg-transparent"
                            aria-label="숙소명 검색"
                          />
                          
                          {/* 검색 결과 드롭다운 */}
                          {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                              {searchResults.map((item) => {
                                const Icon = getTypeIcon(item.type);
                                return (
                                  <div
                                    key={item.id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => handleSearchResultClick(item)}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex-shrink-0">
                                        <Icon className={`h-4 w-4 ${getTypeColor(item.type)}`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-gray-900 text-sm">
                                            {item.name}
                                          </span>
                                          <Badge variant="outline" className="text-xs">
                                            {getTypeLabel(item.type)}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {item.subName} · {item.location}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {tab.id === 'checkin' && (
                        <Input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="border-none p-0 focus-visible:ring-0 text-sm h-auto bg-transparent"
                          aria-label="체크인 날짜 선택"
                        />
                      )}
                      
                      {tab.id === 'checkout' && (
                        <Input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="border-none p-0 focus-visible:ring-0 text-sm h-auto bg-transparent"
                          aria-label="체크아웃 날짜 선택"
                        />
                      )}
                      
                      {tab.id === 'who' && (
                        <Input
                          placeholder="게스트 추가"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="border-none p-0 focus-visible:ring-0 text-sm h-auto bg-transparent"
                          aria-label="게스트 수 입력"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    // 실제 검색 실행 로직
                    console.log('검색 실행:', { searchQuery, checkIn, checkOut, guests, selectedTypes });
                    onClose();
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full flex items-center space-x-2"
                  aria-label="검색 실행"
                >
                  <Search className="h-4 w-4" />
                  <span>검색</span>
                </Button>
              </div>
            </div>

            {/* Subway Map Section */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">지하철 노선도로 검색</h3>
              <p className="text-sm text-gray-600 mb-4">
                지하철 노선도에서 역을 직접 선택하여 주변 숙소를 찾아보세요
              </p>
              <Button
                onClick={() => setShowSubwayMap(true)}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                <Train className="h-4 w-4" />
                <span>지하철 노선도 보기</span>
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">인기 검색어</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { name: '강남역', type: 'subway', icon: Train },
                  { name: '홍대', type: 'area', icon: MapPin },
                  { name: '명동', type: 'area', icon: MapPin },
                  { name: '제주도', type: 'area', icon: MapPin },
                  { name: '부산', type: 'area', icon: MapPin },
                  { name: '경복궁', type: 'attraction', icon: Camera },
                  { name: '한강공원', type: 'attraction', icon: TreePine },
                  { name: '롯데월드', type: 'attraction', icon: Star },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all"
                      onClick={() => handleSearchResultClick({ ...item, id: `popular-${item.name}` })}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${getTypeColor(item.type)}`} />
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accommodation Types */}
            <div className="p-4 sm:p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">숙소 유형</h3>
                <p className="text-sm text-secondary-600 mb-6">
                  원하는 숙소 유형을 선택하여 더 정확한 검색 결과를 받아보세요.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {accommodationTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedTypes.includes(type.id);
                    
                    return (
                      <div
                        key={type.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all bg-white ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                        onClick={() => handleTypeToggle(type.id)}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        aria-label={`${type.name} 선택`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleTypeToggle(type.id);
                          }
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg transition-colors ${
                            isSelected ? 'bg-primary-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isSelected ? 'text-primary-600' : type.color
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                              {type.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-secondary-600 leading-relaxed">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Types Display */}
                {selectedTypes.length > 0 && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                    <h4 className="font-medium text-primary-900 mb-3 text-sm sm:text-base">
                      선택된 숙소 유형 ({selectedTypes.length}개)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTypes.map((typeId) => {
                        const type = accommodationTypes.find(t => t.id === typeId);
                        return type ? (
                          <Badge
                            key={typeId}
                            variant="secondary"
                            className="bg-primary-100 text-primary-800 hover:bg-primary-200 text-xs sm:text-sm"
                          >
                            {type.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom spacing for scroll */}
                <div className="h-8" />
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
      
      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={showSearchResults}
        onClose={() => setShowSearchResults(false)}
        searchQuery={selectedSearchItem?.name || ''}
        searchType={selectedSearchItem?.type || 'area'}
        onMotelSelect={(motelId) => {
          if (onMotelSelect) {
            onMotelSelect(motelId);
          }
          setShowSearchResults(false);
          onClose();
        }}
      />

      {/* Subway Map Modal */}
      <SubwayMapModal
        isOpen={showSubwayMap}
        onClose={() => setShowSubwayMap(false)}
        onStationSelect={handleStationSelect}
      />
    </Dialog>
  );
}