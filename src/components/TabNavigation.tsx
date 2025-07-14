import { Map, List, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';

interface TabNavigationProps {
  activeTab: 'list' | 'map';
  onTabChange: (tab: 'list' | 'map') => void;
  onFiltersClick: () => void;
  resultCount: number;
}

export function TabNavigation({ activeTab, onTabChange, onFiltersClick, resultCount }: TabNavigationProps) {
  return (
    <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant={activeTab === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('list')}
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>목록 ({resultCount})</span>
          </Button>
          
          <Button
            variant={activeTab === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('map')}
            className="flex items-center space-x-2"
          >
            <Map className="h-4 w-4" />
            <span>지도</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onFiltersClick}
          className="flex items-center space-x-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>필터</span>
        </Button>
      </div>
    </div>
  );
}