import { useState } from 'react';
import { ArrowLeft, CreditCard, ChevronRight, MapPin, Calendar, Users, Clock, Share } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShareModal } from './ShareModal';

interface BookingConfirmationProps {
  motel: {
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    address: string;
    images: string[];
  };
  room: {
    name: string;
    description: string;
    maxGuests: number;
  };
  reservation: {
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    basePrice: number;
    serviceFee: number;
    priceType: 'hourly' | 'overnight';
  };
  onBack: () => void;
  onConfirmPayment: () => void;
}

export function BookingConfirmation({ 
  motel, 
  room, 
  reservation, 
  onBack, 
  onConfirmPayment 
}: BookingConfirmationProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentTiming, setPaymentTiming] = useState('now');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [country, setCountry] = useState('KR');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 mr-3"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">확인 및 결제</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="hidden sm:flex items-center space-x-1"
            >
              <Share className="h-4 w-4" />
              <span>공유</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Payment details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment timing */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">1. 결제 시기 선택</h2>
                <Badge variant="outline" className="border-primary-300 text-primary-700">
                  선택됨
                </Badge>
              </div>
              
              <RadioGroup value={paymentTiming} onValueChange={setPaymentTiming}>
                <div className="flex items-start space-x-3 p-4 border-2 border-primary-500 bg-primary-50 rounded-lg">
                  <RadioGroupItem value="now" id="now" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="now" className="font-medium cursor-pointer">
                      지금 ₩{reservation.totalPrice.toLocaleString()} 결제
                    </Label>
                    <p className="text-sm text-secondary-600 mt-1">
                      모든 결제를 지금 완료하며, 나머지는 나중에 결제할 필요가 없습니다.
                      추가 구매하는 항목에는 ₩{Math.round(reservation.basePrice * 0.2).toLocaleString()}의 금액이 청구됩니다.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                  <RadioGroupItem value="partial" id="partial" className="mt-0.5" />
                  <div className="flex-1">
                    <Label htmlFor="partial" className="font-medium cursor-pointer">
                      모든 일부는 지금 결제, 나머지는 나중에 결제
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Payment method */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">2. 결제 수단 추가</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {/* Credit Card */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg ${
                  paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-secondary-600" />
                      <span className="font-medium">신용카드 또는 체크카드</span>
                    </div>
                    <div className="flex space-x-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                    </div>
                  </div>
                </div>

                {/* Card details form */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div>
                      <Label htmlFor="card-number">카드 번호</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">만료일</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardholder">카드 소지자 이름</Label>
                      <Input
                        id="cardholder"
                        placeholder="홍길동"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">국가/지역</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KR">한국</SelectItem>
                          <SelectItem value="US">미국</SelectItem>
                          <SelectItem value="JP">일본</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Naver Pay */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg ${
                  paymentMethod === 'naver' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <RadioGroupItem value="naver" id="naver" />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-success-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">N</span>
                    </div>
                    <span className="font-medium">네이버페이</span>
                  </div>
                </div>

                {/* Kakao Pay */}
                <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg ${
                  paymentMethod === 'kakao' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}>
                  <RadioGroupItem value="kakao" id="kakao" />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-accent-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">K</span>
                    </div>
                    <span className="font-medium">카카오페이(일반페이 + 제휴사)</span>
                  </div>
                </div>
              </RadioGroup>

              <p className="text-sm text-secondary-600 mt-4">
                예약에서 결제 카드 정리가 취소되기 때문에 추가 수수료를 받지 않습니다.
              </p>
            </Card>

            {/* Terms */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">3. 요청 내용 확인</h2>
              <p className="text-sm text-secondary-600">
                아래 버튼을 선택하면 호스트가 정한 숙소 이용규칙, 게스트에게 적용되는 기본 규칙, NODA의{' '}
                <span className="text-primary-600 underline cursor-pointer">재예약 및 환불 정책</span>에 동의하며,{' '}
                피해에 대한 책임이 본인에게 있을 경우 NODA가 결제 수단으로 청구의 진행할 수 있다는 사실에 동의합니다.
              </p>
            </Card>

            {/* Confirm button */}
            <Button 
              onClick={onConfirmPayment}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 text-lg"
              size="lg"
            >
              확인 및 결제
            </Button>
          </div>

          {/* Right column - Booking summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              {/* Motel image and info */}
              <div className="flex space-x-4 mb-6">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={motel.images[0]}
                    alt={motel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{motel.name}</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-sm font-medium">{motel.rating}</span>
                    <span className="text-sm text-secondary-600">({motel.reviewCount}개 후기)</span>
                  </div>
                  <p className="text-sm text-secondary-600">{motel.category}</p>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Room info */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">숙소 수용 인원</h4>
                <p className="text-sm text-secondary-600 mb-4">
                  {reservation.guests}명이 {reservation.priceType === 'hourly' ? '시간' : '박'} 이용하시게 될 모든 전 이용이 활용됩니다.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-secondary-500" />
                    <span>여행 세부 정보</span>
                  </div>
                  <div className="ml-6 text-secondary-600">
                    <p>{reservation.checkIn} ~ {reservation.checkOut}</p>
                    <p>성인 {reservation.guests}명</p>
                  </div>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Price breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium">요금 세부 내역</h4>
                
                <div className="flex justify-between text-sm">
                  <span>₩{reservation.basePrice.toLocaleString()} × {reservation.priceType === 'hourly' ? '시간' : '박'}</span>
                  <span>₩{reservation.basePrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>에어비앤비 서비스 수수료</span>
                  <span>₩{reservation.serviceFee.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>세금</span>
                  <span>₩{Math.round(reservation.basePrice * 0.1).toLocaleString()}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>총액 KRW</span>
                  <span>₩{reservation.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust message */}
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">💎</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-900">좋지 않은 기회입니다.</p>
                    <p className="text-xs text-primary-700 mt-1">
                      Mathieu님의 숙소는 보통 예약이 가득 차 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onMotelSelect={()=>{}}
      />
    </div>
  );
}