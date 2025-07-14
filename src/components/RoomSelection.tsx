import { useState } from 'react';
import { Calendar, Clock, AlertCircle, Camera, Images, Coffee, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { RoomImageGallery } from './RoomImageGallery';

interface RoomOption {
  id: string;
  name: string;
  description: string;
  roomType: string;
  maxGuests: number;
  standardGuests: number;
  bedType: string;
  size: string;
  hourlyRate: number;
  originalHourlyRate?: number;
  overnightRate: number;
  amenities: string[];
  availableRooms: number;
  isTimeSale: boolean;
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  breakfast: {
    included: boolean;
    price: number;
    description: string;
  };
  roomFeatures: string[];
  images: string[];
  additionalInfo: string;
  facilities: string[];
}

interface RoomSelectionProps {
  rooms: RoomOption[];
  onRoomSelect: (room: RoomOption, type: 'hourly' | 'overnight') => void;
}

export function RoomSelection({ rooms, onRoomSelect }: RoomSelectionProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'hourly' | 'overnight'>('hourly');
  const [galleryRoom, setGalleryRoom] = useState<RoomOption | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleRoomSelect = (room: RoomOption, type: 'hourly' | 'overnight') => {
    setSelectedRoom(room.id);
    setSelectedType(type);
    onRoomSelect(room, type);
  };

  const openGallery = (room: RoomOption) => {
    setGalleryRoom(room);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setGalleryRoom(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>객실 선택</h2>
        <div className="text-sm text-secondary-600">
          총 {rooms.length}개 객실
        </div>
      </div>

      <div className="space-y-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200">
            <div className="flex flex-col lg:flex-row">
              {/* Room Image with Hover Effect */}
              <div className="relative w-full lg:w-80 h-64 lg:h-auto flex-shrink-0 group">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Image Count Badge */}
                {room.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm flex items-center space-x-1">
                    <Camera className="h-3 w-3" />
                    <span>{room.images.length}+</span>
                  </div>
                )}

                {/* Time Sale Badge */}
                {room.isTimeSale && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 text-white hover:bg-red-700 text-xs px-2 py-1">
                      TIME SALE
                    </Badge>
                  </div>
                )}

                {/* Gallery Button - Appears on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={() => openGallery(room)}
                    className="bg-white text-gray-900 hover:bg-gray-100 flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg"
                  >
                    <Images className="h-4 w-4" />
                    <span>사진 보기</span>
                  </Button>
                </div>
              </div>

              {/* Room Content */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  {/* 상단: 객실 정보 */}
                  <div className="flex-1 mb-6">
                    {/* Room Title and Description */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
                        {room.name}
                      </h3>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        {room.description}
                      </p>
                    </div>

                    {/* Room Details Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-4">
                      {/* 숙박 정보 */}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">숙박</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>체크인 {room.checkInTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 ml-6">
                          <span>체크아웃 {room.checkOutTime}</span>
                        </div>
                      </div>

                      {/* 조식 정보 */}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">조식</div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Coffee className="h-4 w-4" />
                          <span className={room.breakfast.included ? 'text-success-600' : 'text-gray-600'}>
                            {room.breakfast.description}
                          </span>
                        </div>
                      </div>

                      {/* 객실정보 */}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">객실정보</div>
                        <div className="text-sm text-gray-600">
                          {room.roomType} · 최대 {room.maxGuests}인 · {room.size}
                        </div>
                      </div>

                      {/* 부가정보 */}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">부가정보</div>
                        <div className="text-sm text-gray-600">
                          {room.roomFeatures.slice(0, 2).join(' · ')}
                        </div>
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="flex items-center space-x-2">
                      {room.cancellationPolicy === '무료취소 불가' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-success-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className={`text-sm font-medium ${
                        room.cancellationPolicy === '무료취소 불가' ? 'text-red-600' : 'text-success-600'
                      }`}>
                        {room.cancellationPolicy}
                      </span>
                    </div>
                  </div>

                  {/* 하단: 가격 및 예약 정보 */}
                  <div className="border-t pt-4">
                    <div className="flex items-end justify-between">
                      {/* 가격 정보 */}
                      <div>
                        <div className="flex items-baseline space-x-2 mb-1">
                          {room.originalHourlyRate && (
                            <span className="text-lg text-gray-400 line-through">
                              ₩{room.originalHourlyRate.toLocaleString()}
                            </span>
                          )}
                          {room.originalHourlyRate && (
                            <Badge className="bg-red-600 text-white text-xs px-2 py-1">
                              43% 할인
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-2xl font-bold text-gray-900">
                            ₩{room.hourlyRate.toLocaleString()}
                          </span>
                          <span className="text-gray-600">/ 박</span>
                        </div>
                        <div className="text-success-600 font-medium text-sm mb-1">
                          ₩{(room.originalHourlyRate! - room.hourlyRate).toLocaleString()} 절약!
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          타임세일 특가 진행 중!
                        </div>
                      </div>

                      {/* 예약 버튼 */}
                      <div className="text-right">
                        <Button
                          onClick={() => handleRoomSelect(room, 'hourly')}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-base font-medium"
                          size="lg"
                        >
                          예약하기
                        </Button>
                        
                        {/* Additional Notes */}
                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                          <div>• 세금 및 수수료 포함</div>
                          {!room.breakfast.included && (
                            <div>• 조식 불포함</div>
                          )}
                          {room.isTimeSale && (
                            <div className="text-red-600 font-medium">• 타임세일 특가</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">예약 시 참고사항</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="space-y-2">
            <div>• 체크인 시 신분증 및 카드 확인이 필요합니다</div>
            <div>• 반려동물 동반은 사전 문의 후 가능합니다</div>
          </div>
          <div className="space-y-2">
            <div>• 객실 내 금연이며, 흡연 시 청소비가 부과됩니다</div>
            <div>• 예약 변경 및 취소는 예약 조건에 따라 제한될 수 있습니다</div>
          </div>
        </div>
      </div>

      {/* Room Image Gallery Modal */}
      {galleryRoom && (
        <RoomImageGallery
          isOpen={isGalleryOpen}
          onClose={closeGallery}
          images={galleryRoom.images}
          roomName={galleryRoom.name}
        />
      )}
    </div>
  );
}