import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import MapView from './MapView';
import { BottomSheet } from './BottomSheet';
import { SearchFilters } from './SearchFilters';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MotelCard } from './MotelCard';
import { DiscountSection } from './DiscountSection';
import { EventSection } from './EventSection';
import { EventModal } from './EventModal';

interface MobileMapLayoutProps {
  motels: any[];
  markers: any[];
  onMotelClick: (id: string) => void;
  onMarkerClick: (id: string) => void;
  selectedMotelId: string | null;
  clickedMotelId?: string | null;
  showFilters: boolean;
  onFiltersToggle: () => void;
}

export function MobileMapLayout({
  motels,
  markers,
  onMotelClick,
  onMarkerClick,
  selectedMotelId,
  clickedMotelId,
  showFilters,
  onFiltersToggle
}: MobileMapLayoutProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true);
  const [snapPoints] = useState([15, 45, 85]);
  const [currentSnap, setCurrentSnap] = useState(0); // 가장 낮은 높이에서 시작
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // 클릭된 모텔이 있는 경우 해당 모텔만 표시
  const displayMotels = clickedMotelId 
    ? motels.filter(motel => motel.id === clickedMotelId)
    : motels;

  // 선택된 모텔이 있을 때 자동으로 바텀시트 중간 높이로 열기
  useEffect(() => {
    if (selectedMotelId) {
      setCurrentSnap(1); // 중간 높이로 열기
    }
  }, [selectedMotelId]);

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleShowMap = () => {
    setCurrentSnap(0); // 최소 높이로 축소
  };

  const handleSnapChange = (snap: number) => {
    setCurrentSnap(snap);
  };

  // 최대 높이일 때 확인
  const isMaxHeight = currentSnap === snapPoints.length - 1;

  return (
    <div className="h-full relative">
      {/* 지도 - 전체 화면 */}
      <div className="absolute inset-0">
        <MapView
          markersData={markers}
          onMarkerClick={onMarkerClick}
        />
      </div>

      {/* 상단 오버레이 - 필터 상태 표시 */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white shadow-sm">
              숙소 {displayMotels.length}개
            </Badge>
            {showFilters && (
              <Badge variant="outline" className="bg-white shadow-sm">
                필터 적용됨
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 지도보기 플로팅 버튼 - 최대 높이일 때만 표시 */}
      {isMaxHeight && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={handleShowMap}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 border-2 border-white"
          >
            <MapPin className="h-4 w-4" />
            <span>지도보기</span>
          </Button>
        </div>
      )}

      {/* 하단 시트 - 모텔 리스트 */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onToggle={() => setIsBottomSheetOpen(!isBottomSheetOpen)}
        snapPoints={snapPoints}
        initialSnap={currentSnap}
        currentSnap={currentSnap}
        onSnapChange={handleSnapChange}
      >
        <div className="h-full overflow-hidden flex flex-col">
          {/* 헤더 - 고정 */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">
                근처 숙소 {displayMotels.length}개
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onFiltersToggle}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  필터
                </button>
              </div>
            </div>

            {/* 필터 섹션 */}
            {showFilters && (
              <div className="mb-3">
                <SearchFilters isOpen={showFilters} onClose={onFiltersToggle} />
              </div>
            )}
          </div>

          {/* 스크롤 가능한 목록 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* 할인 섹션 */}
            <div className="mb-4">
              <DiscountSection />
            </div>

            {/* 이벤트 섹션 */}
            <div className="mb-4">
              <EventSection onShowMore={() => setIsEventModalOpen(true)} />
            </div>

            {/* 모텔 리스트 */}
            <div className="space-y-3">
              {displayMotels.map((motel) => (
                <div key={motel.id} className="w-full">
                  <MotelCard
                    motel={motel}
                    onClick={() => onMotelClick(motel.id)}
                    isFavorite={favorites.has(motel.id)}
                    onToggleFavorite={(event: React.MouseEvent) => toggleFavorite(motel.id, event)}
                    isSelected={selectedMotelId === motel.id}
                    isHovered={clickedMotelId === motel.id}
                    isMobile={true} // 모바일 모드로 설정
                  />
                </div>
              ))}
            </div>

            {/* 하단 여백 - 플로팅 버튼과의 겹침 방지 */}
            <div className="h-24"></div>
          </div>
        </div>
      </BottomSheet>

      {/* 이벤트 모달 */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
}