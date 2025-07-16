"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { MotelList } from "../components/MotelList";
import { MapView } from "../components/MapView";
import { TabNavigation } from "../components/TabNavigation";
import { MotelDetail } from "../components/MotelDetail";
import { BookingConfirmation } from "../components/BookingConfirmation";
import { LoginModal } from "../components/LoginModal";
import { MobileMapLayout } from "../components/MobileMapLayout";
import { ReviewsPage } from "../components/ReviewsPage";
import { Toaster } from "../components/ui/sonner";

// Mock review data
const mockReviews = [
  {
    id: 'review1',
    userId: 'user1',
    userName: '자렴착이고집멀츠숭치',
    userLevel: '베스트리뷰',
    rating: 5,
    date: '1개월 전',
    reviewCount: 8,
    visitCount: 24,
    guestCount: 7,
    title: '다른스 더블',
    content: '2성금이라도 호텔이라 그런지 고급져었어요...',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'],
    helpful: 0,
    roomType: '[선착순특가] 체크인 시 배정',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  }
];

// Enhanced mock data for motels with comprehensive room information
const mockMotels = [
  {
    id: '1',
    name: '신화관 제주신화월드 호텔앤리조트',
    category: '5성급',
    distance: '0.5km',
    location: '제주도 서귀포시',
    rating: 4.95,
    reviewCount: 123,
    price: 178598,
    originalPrice: 357196,
    isRecommended: true,
    amenities: ['wifi', 'parking', 'pool', 'spa', 'restaurant'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
    address: '제주특별자치도 서귀포시 안덕면 신화월드로 38',
    phone: '064-123-4567',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    host: {
      name: 'Patrice',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      isHost: true
    },
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop'
    ],
    reviews: mockReviews,
    rooms: [
      {
        id: 'room1-1',
        name: '[TIME SALE Room only] 디럭스 패밀리 트윈',
        description: '★Spot Sale 무료★미니바 무료, 3-4층, 발코니 없음',
        roomType: '더블 침대 1개',
        maxGuests: 4,
        standardGuests: 2,
        bedType: '더블 침대 1개',
        size: '25㎡',
        hourlyRate: 415800,
        originalHourlyRate: 726000,
        overnightRate: 25000,
        amenities: ['wifi', 'parking', 'minibar', 'balcony'],
        availableRooms: 1,
        isTimeSale: true,
        cancellationPolicy: '무료취소 불가',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        breakfast: {
          included: false,
          price: 35000,
          description: '조식 불포함'
        },
        roomFeatures: ['미니바 무료', '발코니 없음', '시티뷰'],
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'],
        additionalInfo: '기준 2인, 최대 상위 2인 시 추가 12세 미만 어린이 1인',
        facilities: ['기준정보', '추가정보']
      }
    ]
  }
];

// Mock map markers
const mockMarkers = mockMotels.map((motel, index) => ({
  id: motel.id,
  name: motel.name,
  price: motel.price,
  lat: 37.5665 + index * 0.01,
  lng: 126.978 + index * 0.01,
}));

export default function App() {
  const [selectedMotelId, setSelectedMotelId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'booking' | 'reviews'>('list');
  const [bookingData, setBookingData] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleMotelClick = (id: string) => {
    setSelectedMotelId(id);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedMotelId(null);
    setBookingData(null);
    setSelectedRoom(null);
  };

  const handleBackToDetail = () => {
    setViewMode('detail');
    setBookingData(null);
    setSelectedRoom(null);
  };

  const handleViewReviews = () => {
    setViewMode('reviews');
  };

  const handleMarkerClick = (id: string) => {
    setSelectedMotelId(id);
  };

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleReservation = (reservation: any, room: any) => {
    setBookingData(reservation);
    setSelectedRoom(room);
    setViewMode('booking');
  };

  const handleConfirmPayment = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    } else {
      alert('결제가 완료되었습니다!');
      handleBackToList();
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setTimeout(() => {
      alert('결제가 완료되었습니다!');
      handleBackToList();
    }, 500);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const markersWithSelection = mockMarkers.map(marker => ({
    ...marker,
    isSelected: marker.id === selectedMotelId
  }));

  const selectedMotel = mockMotels.find(motel => motel.id === selectedMotelId);

  if (viewMode === "reviews" && selectedMotel) {
    return (
      <ReviewsPage
        motel={selectedMotel}
        reviews={selectedMotel.reviews}
        onBack={handleBackToDetail}
      />
    );
  }

  if (viewMode === "booking" && selectedMotel && bookingData && selectedRoom) {
    return (
      <>
        <BookingConfirmation
          motel={selectedMotel}
          room={selectedRoom}
          reservation={bookingData}
          onBack={handleBackToDetail}
          onConfirmPayment={handleConfirmPayment}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  if (viewMode === "detail" && selectedMotel) {
    return (
      <MotelDetail
        motel={selectedMotel}
        onBack={handleBackToList}
        onReservation={handleReservation}
        onViewReviews={handleViewReviews}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onMotelSelect={handleMotelClick}
        onLoginClick={handleLoginClick}
      />

      <main className="flex-1 overflow-hidden">
        {/* Mobile Layout */}
        <div className="lg:hidden h-[calc(100vh-64px)]">
          <MobileMapLayout
            motels={mockMotels}
            markers={markersWithSelection}
            onMotelClick={handleMotelClick}
            onMarkerClick={handleMarkerClick}
            selectedMotelId={selectedMotelId}
            showFilters={showFilters}
            onFiltersToggle={handleFiltersToggle}
          />
        </div>

        {/* Desktop Layout - Full Width */}
        <div className="hidden lg:flex h-[calc(100vh-64px)]">
          {/* Left Panel - Fixed Width */}
          <div className="w-[580px] flex-shrink-0 overflow-auto bg-background border-r border-gray-200">
            <div className="p-6">
              <MotelList
                motels={mockMotels}
                onMotelClick={handleMotelClick}
                showFilters={showFilters}
                onFiltersToggle={handleFiltersToggle}
              />
            </div>
          </div>

          {/* Right Panel - Full Remaining Width */}
          <div className="flex-1 relative">
            <MapView
              markers={markersWithSelection}
              onMarkerClick={handleMarkerClick}
              isExpanded={isMapExpanded}
              onToggleExpand={() =>
                setIsMapExpanded(!isMapExpanded)
              }
              selectedMotelId={selectedMotelId}
            />
          </div>
        </div>
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Toaster />
    </div>
  );
}
