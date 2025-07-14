import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface EventSectionProps {
  onShowMore: () => void;
}

export function EventSection({ onShowMore }: EventSectionProps) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">숙소 이벤트</h3>
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
            [유레카] 수영장 패키지] 이용 안내
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onShowMore}
          className="text-gray-600 hover:text-gray-800 flex items-center space-x-1 flex-shrink-0 px-2 sm:px-3"
        >
          <span className="text-xs sm:text-sm">더보기</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}