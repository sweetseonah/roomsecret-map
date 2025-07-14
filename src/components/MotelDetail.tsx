import { useState } from 'react';
import { ArrowLeft, Share, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { ImageGallery } from './ImageGallery';
import { MotelDetailHeader } from './MotelDetailHeader';
import { RoomSelection } from './RoomSelection';
import { ReservationSection } from './ReservationSection';
import { ReviewSection } from './ReviewSection';
import { ShareModal } from './ShareModal';
import { DiscountSection } from './DiscountSection';
import { EventSection } from './EventSection';
import { EventModal } from './EventModal';

interface MotelDetailProps {
  motel: {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    address: string;
    phone: string;
    checkInTime: string;
    checkOutTime: string;
    amenities: string[];
    isRecommended?: boolean;
    images: string[];
    reviews: Array<{
      id: string;
      userId: string;
      userName: string;
      userLevel: string;
      rating: number;
      date: string;
      reviewCount: number;
      visitCount: number;
      guestCount: number;
      title: string;
      content: string;
      images: string[];
      helpful: number;
      roomType: string;
      avatar: string;
    }>;
    rooms: Array<{
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
    }>;
  };
  onBack: () => void;
  onReservation: (reservation: any, room: any) => void;
  onViewReviews: () => void;
}

export function MotelDetail({ motel, onBack, onReservation, onViewReviews }: MotelDetailProps) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [priceType, setPriceType] = useState<'hourly' | 'overnight'>('hourly');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const handleRoomSelect = (room: any, type: 'hourly' | 'overnight') => {
    setSelectedRoom(room);
    setPriceType(type);
  };

  const handleReservation = (data: any) => {
    const currentRoom = selectedRoom || motel.rooms[0];
    const basePrice = priceType === 'hourly' ? currentRoom.hourlyRate : currentRoom.overnightRate;
    
    const reservation = {
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      totalPrice: data.totalPrice,
      basePrice: basePrice,
      serviceFee: Math.round(basePrice * 0.05),
      taxFee: Math.round(basePrice * 0.1),
      priceType: priceType
    };
    
    onReservation(reservation, currentRoom);
  };

  const currentRoom = selectedRoom || motel.rooms[0];
  const basePrice = currentRoom 
    ? (priceType === 'hourly' ? currentRoom.hourlyRate : currentRoom.overnightRate)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-900 truncate max-w-md">
                  {motel.name}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="hover:bg-gray-100"
              >
                <Share className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">공유</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">저장</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            <ImageGallery images={motel.images} motelName={motel.name} />
            
            {/* Motel info */}
            <MotelDetailHeader
              name={motel.name}
              category={motel.category}
              rating={motel.rating}
              reviewCount={motel.reviewCount}
              address={motel.address}
              phone={motel.phone}
              checkInTime={motel.checkInTime}
              checkOutTime={motel.checkOutTime}
              amenities={motel.amenities}
              isRecommended={motel.isRecommended}
            />

            {/* 할인 및 이벤트 섹션 - 편의시설 아래에 배치 */}
            <div className="space-y-4">
              {/* 할인 섹션 */}
              <DiscountSection />

              {/* 이벤트 섹션 */}
              <EventSection onShowMore={() => setIsEventModalOpen(true)} />
            </div>

            {/* Room selection */}
            <RoomSelection
              rooms={motel.rooms}
              onRoomSelect={handleRoomSelect}
            />

            {/* Reviews section */}
            <ReviewSection
              rating={motel.rating}
              reviewCount={motel.reviewCount}
              reviews={motel.reviews}
              onViewAllReviews={onViewReviews}
            />
          </div>

          {/* Right column - Reservation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReservationSection
                basePrice={basePrice}
                priceType={priceType}
                onReservation={handleReservation}
                selectedRoom={currentRoom}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        motel={motel}
      />

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
}