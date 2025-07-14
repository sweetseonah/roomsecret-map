import { Calendar, Clock, Users, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface SearchFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SearchFilters({ isOpen = true, onClose }: SearchFiltersProps) {
  if (!isOpen) return null;

  return (
    <Card className="p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between mb-3 lg:hidden">
        <h3 className="font-semibold">필터</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Horizontal scrollable filters for mobile */}
      <ScrollArea className="w-full lg:hidden">
        <div className="flex space-x-2 pb-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-2 whitespace-nowrap hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
            <Calendar className="h-4 w-4" />
            <span>오늘</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2 whitespace-nowrap hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
            <Clock className="h-4 w-4" />
            <span>대실·숙박</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2 whitespace-nowrap hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
            <Users className="h-4 w-4" />
            <span>게스트</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2 whitespace-nowrap hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
            <Filter className="h-4 w-4" />
            <span>더보기</span>
          </Button>
        </div>
      </ScrollArea>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-wrap gap-2 items-center">
        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
          <Calendar className="h-4 w-4" />
          <span>오늘</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
          <Clock className="h-4 w-4" />
          <span>대실 · 숙박</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
          <Users className="h-4 w-4" />
          <span>게스트 추가</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700">
          <Filter className="h-4 w-4" />
          <span>필터</span>
        </Button>

        <div className="flex flex-wrap gap-1 ml-auto">
          <Badge variant="secondary" className="bg-primary-100 text-primary-700 hover:bg-primary-200">
            강남
          </Badge>
          <Badge variant="secondary" className="bg-primary-100 text-primary-700 hover:bg-primary-200">
            5만원 이하
          </Badge>
        </div>
      </div>

      {/* Active filters for mobile */}
      <div className="flex flex-wrap gap-1 mt-3 lg:hidden">
        <Badge variant="secondary" className="bg-primary-100 text-primary-700">
          강남
        </Badge>
        <Badge variant="secondary" className="bg-primary-100 text-primary-700">
          5만원 이하
        </Badge>
      </div>
    </Card>
  );
}