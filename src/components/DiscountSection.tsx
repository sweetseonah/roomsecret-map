import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CouponModal } from './CouponModal';

export function DiscountSection() {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const handleSubscribe = () => {
    setIsCouponModalOpen(true);
  };

  return (
    <>
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 font-medium text-sm sm:text-base">최대</span>
            <Badge className="bg-primary-600 text-white px-2 py-1 text-xs sm:text-sm">
              1%
            </Badge>
            <span className="text-gray-800 font-medium text-sm sm:text-base">할인</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSubscribe}
            className="bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">구독받기</span>
          </Button>
        </div>
      </div>

      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
      />
    </>
  );
}