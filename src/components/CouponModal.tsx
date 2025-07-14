import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X, Tag, Clock, Users, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Coupon {
  id: string;
  title: string;
  discount: string;
  validPeriod: string;
  additionalInfo?: string;
  isActive: boolean;
  maxDiscount?: string;
}

export function CouponModal({ isOpen, onClose }: CouponModalProps) {
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());

  const handleDownloadCoupon = (couponId: string, couponTitle: string) => {
    // 쿠폰 다운로드 로직
    console.log(`다운로드: ${couponTitle}`);
    
    setDownloadedCoupons(prev => new Set([...prev, couponId]));
    // 토스트 알림 대신 콘솔 로그 사용
    console.log(`${couponTitle} 쿠폰이 다운로드되었습니다!`);
  };

  const handleDownloadAll = () => {
    const activeCoupons = coupons.filter(coupon => coupon.isActive);
    const newDownloaded = new Set(downloadedCoupons);
    
    activeCoupons.forEach(coupon => {
      if (!downloadedCoupons.has(coupon.id)) {
        newDownloaded.add(coupon.id);
      }
    });
    
    setDownloadedCoupons(newDownloaded);
    console.log(`${activeCoupons.length}개의 쿠폰이 모두 다운로드되었습니다!`);
  };

  const coupons: Coupon[] = [
    {
      id: '1',
      title: '첫 예약 할인',
      discount: '20%',
      validPeriod: '2024.12.31까지',
      additionalInfo: '최대 30,000원 할인',
      isActive: true,
      maxDiscount: '30,000원'
    },
    {
      id: '2',
      title: '주말 특가',
      discount: '15%',
      validPeriod: '2024.12.25까지',
      additionalInfo: '금요일-일요일 숙박 시',
      isActive: true,
      maxDiscount: '20,000원'
    },
    {
      id: '3',
      title: '장기 숙박 할인',
      discount: '25%',
      validPeriod: '2024.11.30까지',
      additionalInfo: '3박 이상 예약 시',
      isActive: false,
      maxDiscount: '50,000원'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              쿠폰함
            </DialogTitle>
            <Button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            사용 가능한 쿠폰을 확인하고 다운로드하세요.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* 모두 다운로드 버튼 */}
          <div className="flex justify-end">
            <Button
              onClick={handleDownloadAll}
              className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md"
            >
              <Download className="h-4 w-4 mr-2" />
              모두 다운로드
            </Button>
          </div>

          {/* 쿠폰 리스트 */}
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`border rounded-lg p-4 transition-all ${
                coupon.isActive
                  ? 'border-primary-200 bg-primary-50/30'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 쿠폰 헤더 */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Tag className="h-4 w-4 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">{coupon.title}</h3>
                    <Badge 
                      className={`text-xs ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {coupon.isActive ? '사용 가능' : '만료됨'}
                    </Badge>
                  </div>

                  {/* 할인 정보 */}
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-primary-600">
                      {coupon.discount}
                    </span>
                    {coupon.maxDiscount && (
                      <span className="text-sm text-gray-600 ml-2">
                        (최대 {coupon.maxDiscount})
                      </span>
                    )}
                  </div>

                  {/* 추가 정보 */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>유효기간: {coupon.validPeriod}</span>
                    </div>
                    {coupon.additionalInfo && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{coupon.additionalInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  <Button
                    onClick={() => handleDownloadCoupon(coupon.id, coupon.title)}
                    disabled={!coupon.isActive || downloadedCoupons.has(coupon.id)}
                    className={`flex items-center space-x-1 px-3 py-1.5 text-sm border rounded-md ${
                      coupon.isActive
                        ? 'border-primary-600 text-primary-600 hover:bg-primary-50'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Download className="h-3 w-3" />
                    <span>
                      {downloadedCoupons.has(coupon.id) 
                        ? '다운로드 완료' 
                        : '다운로드'
                      }
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 안내 텍스트 */}
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800">
            💡 다운로드된 쿠폰은 예약 시 자동으로 적용됩니다. 쿠폰은 중복 사용이 불가능하며, 
            조건에 맞지 않는 경우 자동으로 제외됩니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}