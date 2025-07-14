import { useState } from 'react';
import { Calendar, Clock, Users, CreditCard, Info, Coffee, Shield, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface ReservationSectionProps {
  basePrice: number;
  priceType: 'hourly' | 'overnight';
  onReservation: (data: ReservationData) => void;
  selectedRoom?: {
    id: string;
    name: string;
    description: string;
    roomType: string;
    maxGuests: number;
    standardGuests: number;
    availableRooms: number;
    isTimeSale: boolean;
    cancellationPolicy: string;
    originalHourlyRate?: number;
    breakfast: {
      included: boolean;
      price: number;
      description: string;
    };
    roomFeatures: string[];
  };
}

interface ReservationData {
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export function ReservationSection({ basePrice, priceType, onReservation, selectedRoom }: ReservationSectionProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  
  const serviceFee = Math.round(basePrice * 0.05);
  const taxFee = Math.round(basePrice * 0.1);
  const extraGuestFee = guests > (selectedRoom?.standardGuests || 2) 
    ? (guests - (selectedRoom?.standardGuests || 2)) * 15000 
    : 0;
  const totalPrice = basePrice + serviceFee + taxFee + extraGuestFee;
  const discountAmount = selectedRoom?.originalHourlyRate 
    ? selectedRoom.originalHourlyRate - basePrice 
    : 0;

  const handleReservation = () => {
    const reservationData: ReservationData = {
      checkIn,
      checkOut,
      guests,
      totalPrice,
    };
    onReservation(reservationData);
  };

  const isFormValid = checkIn && checkOut && guests;

  return (
    <div className="space-y-6">
      {/* Selected Room Summary */}
      {selectedRoom && (
        <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-primary-900 mb-1">
                  선택한 객실
                </h3>
                <p className="text-primary-700 text-sm font-medium mb-2">
                  {selectedRoom.name}
                </p>
                <p className="text-primary-600 text-sm">
                  {selectedRoom.roomType} · 최대 {selectedRoom.maxGuests}인
                </p>
              </div>
              {selectedRoom.isTimeSale && (
                <Badge className="bg-red-600 text-white">
                  TIME SALE
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Coffee className="h-4 w-4 text-primary-600" />
                <span className={selectedRoom.breakfast.included ? 'text-success-600' : 'text-gray-600'}>
                  {selectedRoom.breakfast.description}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary-600" />
                <span className={selectedRoom.cancellationPolicy === '무료취소 불가' ? 'text-red-600' : 'text-success-600'}>
                  {selectedRoom.cancellationPolicy}
                </span>
              </div>
            </div>

            <div className="text-xs text-primary-600">
              남은 객실 {selectedRoom.availableRooms}개 · 빠른 예약 권장
            </div>
          </div>
        </Card>
      )}

      {/* Reservation Form */}
      <Card className="p-6 border-primary-100">
        <div className="space-y-6">
          {/* Price Header */}
          <div className="text-center">
            {selectedRoom?.originalHourlyRate && (
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-lg text-gray-400 line-through">
                  ₩{selectedRoom.originalHourlyRate.toLocaleString()}
                </span>
                <Badge variant="destructive" className="text-xs">
                  {Math.round((discountAmount / selectedRoom.originalHourlyRate) * 100)}% 할인
                </Badge>
              </div>
            )}
            <div className="flex items-baseline justify-center space-x-2">
              <span className="text-3xl font-bold text-primary-700">
                ₩{basePrice.toLocaleString()}
              </span>
              <span className="text-gray-500">
                / {priceType === 'hourly' ? '박' : '시간'}
              </span>
            </div>
            {discountAmount > 0 && (
              <p className="text-sm text-success-600 font-medium mt-1">
                ₩{discountAmount.toLocaleString()} 절약!
              </p>
            )}
          </div>

          <Separator />

          {/* Date and Guest Selection */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="check-in" className="text-sm font-semibold text-gray-700 mb-2 block">
                  체크인
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="check-in"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10 focus:border-primary-500 focus:ring-primary-500 bg-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="check-out" className="text-sm font-semibold text-gray-700 mb-2 block">
                  체크아웃
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="check-out"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10 focus:border-primary-500 focus:ring-primary-500 bg-white"
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="guests" className="text-sm font-semibold text-gray-700 mb-2 block">
                투숙 인원
              </Label>
              <Select value={guests.toString()} onValueChange={(value) => setGuests(Number(value))}>
                <SelectTrigger className="focus:border-primary-500 focus:ring-primary-500 bg-white">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedRoom?.maxGuests || 4 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>게스트 {num}명</span>
                        {num <= (selectedRoom?.standardGuests || 2) ? (
                          <Badge variant="secondary" className="ml-2 text-xs">기준</Badge>
                        ) : (
                          <Badge variant="outline" className="ml-2 text-xs text-amber-600">+{((num - (selectedRoom?.standardGuests || 2)) * 15000).toLocaleString()}원</Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">요금 상세</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  객실 요금 × 1{priceType === 'hourly' ? '박' : '시간'}
                </span>
                <span className="font-medium">₩{basePrice.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">서비스 수수료</span>
                <span className="font-medium">₩{serviceFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">세금 및 수수료</span>
                <span className="font-medium">₩{taxFee.toLocaleString()}</span>
              </div>
              
              {extraGuestFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    추가 인원 요금 ({guests - (selectedRoom?.standardGuests || 2)}명)
                  </span>
                  <span className="font-medium">₩{extraGuestFee.toLocaleString()}</span>
                </div>
              )}
            </div>

            <Separator />
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">총 결제 금액</span>
              <span className="font-bold text-xl text-primary-700">
                ₩{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Special Offers */}
          {selectedRoom?.isTimeSale && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Tag className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800 mb-1">타임세일 특가 진행 중!</p>
                  <p className="text-sm text-red-700">
                    선착순 한정 특가로 빠른 예약을 권장합니다. 
                    {discountAmount > 0 && ` 총 ₩${discountAmount.toLocaleString()} 절약!`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reserve Button */}
          <Button 
            className={`w-full shadow-lg transition-all duration-200 h-12 text-base font-semibold ${
              isFormValid 
                ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleReservation}
            disabled={!isFormValid}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isFormValid ? `₩${totalPrice.toLocaleString()} 결제하기` : '날짜와 인원을 선택하세요'}
          </Button>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 space-y-1">
                <p className="font-medium">예약 전 확인사항</p>
                <ul className="space-y-1 text-xs">
                  <li>• 예약 확정 전에는 요금이 청구되지 않습니다</li>
                  <li>• 체크인 시 신분증 확인이 필요합니다</li>
                  {selectedRoom?.cancellationPolicy === '무료취소 불가' && (
                    <li className="text-red-600">• 예약 후 취소 및 환불이 불가능합니다</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}