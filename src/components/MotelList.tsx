import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SearchFilters } from './SearchFilters';
import { MotelCard } from './MotelCard';
import { DiscountSection } from './DiscountSection';
import { EventSection } from './EventSection';
import { EventModal } from './EventModal';

interface Motel {
  id: string;
  name: string;
  category: string;
  distance: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  isRecommended?: boolean;
  amenities: string[];
  isAvailable: boolean;
  imageUrl: string;
  images?: string[];
  host?: {
    name: string;
    avatar: string;
    isHost: boolean;
  };
}

interface MotelListProps {
  motels: Motel[];
  onMotelClick: (id: string) => void;
  showFilters: boolean;
  onFiltersToggle: () => void;
}

export function MotelList({ motels, onMotelClick, showFilters, onFiltersToggle }: MotelListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

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

  const filteredMotels = motels.filter(motel =>
    motel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    motel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMotels = [...filteredMotels].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      default:
        return b.isRecommended ? 1 : -1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 pb-6 -mx-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            숙소 {filteredMotels.length}개
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onFiltersToggle}
            className="flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>필터</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="목적지 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-gray-400 focus:ring-0"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            7월 25일 - 27일 · 게스트 2명
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 border-0 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">추천순</SelectItem>
              <SelectItem value="price-low">가격 낮은순</SelectItem>
              <SelectItem value="price-high">가격 높은순</SelectItem>
              <SelectItem value="rating">평점순</SelectItem>
              <SelectItem value="distance">거리순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 -mx-6 mx-6">
          <SearchFilters onFiltersChange={(filters) => console.log('Filters changed:', filters)} />
        </div>
      )}

      {/* Discount Section */}
      <DiscountSection />

      {/* Event Section */}
      <EventSection onShowMore={() => setIsEventModalOpen(true)} />

      {/* Motels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedMotels.map((motel) => (
          <MotelCard
            key={motel.id}
            motel={motel}
            onClick={() => onMotelClick(motel.id)}
            isFavorite={favorites.has(motel.id)}
            onToggleFavorite={(event) => toggleFavorite(motel.id, event)}
          />
        ))}
      </div>

      {/* No Results */}
      {sortedMotels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">검색 결과가 없습니다</p>
            <p className="text-sm">다른 검색어를 입력해보세요</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setSearchTerm('')}
            className="mt-4"
          >
            검색 초기화
          </Button>
        </div>
      )}

      {/* Load More */}
      {sortedMotels.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">
            {sortedMotels.length}개 숙소 중 {Math.min(sortedMotels.length, 20)}개 표시됨
          </p>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
}