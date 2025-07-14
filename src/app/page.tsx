'use client';

import { useState } from 'react';
import { Header } from '../components/Header';
import { MotelList } from '../components/MotelList';
import { MapView } from '../components/MapView';
import { TabNavigation } from '../components/TabNavigation';
import { MotelDetail } from '../components/MotelDetail';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { LoginModal } from '../components/LoginModal';
import { MobileMapLayout } from '../components/MobileMapLayout';
import { ReviewsPage } from '../components/ReviewsPage';
import { Toaster } from '../components/ui/sonner';

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
    content: '2성금이라도 호텔이라 그런지 고급져었어요. 방옆도 나름 작앞고 수간도 넓었하고 급음 있는 데는 오랜만에 봐서 신기했어요. 아뜨도 대부분 가능하다네 똣똣리스는 설어인저응 안 되어있어요',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop'
    ],
    helpful: 0,
    roomType: '[선착순특가] 체크인 시 배정',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review2',
    userId: 'user2',
    userName: '편안하고편벌복협춘겨',
    userLevel: '리뷰 2',
    rating: 4,
    date: '1개월 전',
    reviewCount: 2,
    visitCount: 16,
    guestCount: 2,
    title: '비즈니스 트윈',
    content: '시워배다 시위 투 트 그어이 악어 뇌 북한 머어 시는 따어리 오뺑한 버무 단서 공급에서 있으나 벽시애대 날아 었어 써서 신기써거 겨어 놈너여서 컵 를있이므 안직여터요',
    images: [],
    helpful: 1,
    roomType: '[선착순특가] 체크인 시 배정',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review3',
    userId: 'user3',
    userName: '오데이',
    userLevel: '리뷰 1',
    rating: 4,
    date: '1개월 전',
    reviewCount: 1,
    visitCount: 10,
    guestCount: 1,
    title: '[선착순특가] 체크인 시 배정',
    content: '숙소는 깔끔하고 좋으나 처음 업장했떠 사우나 냄새도 잠올어 있으나 범회에 대한어 난이 있어 매우 불혜웠습니다 능은시치이어서 검플래인은 안직여 널어리네요',
    images: [],
    helpful: 1,
    roomType: '[선착순특가] 체크인 시 배정',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review4',
    userId: 'user4',
    userName: '5590592',
    userLevel: '리뷰 2',
    rating: 5,
    date: '10일 전',
    reviewCount: 2,
    visitCount: 7,
    guestCount: 2,
    title: '비즈니스 트윈',
    content: '깔끔하고 조용하고 주변에 맛집들도 많고 교통시셔이 편리해서 시틀 여행이 편했습니다. 차후에 재방문 예정입니다.',
    images: [],
    helpful: 0,
    roomType: '비즈니스 트윈',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review5',
    userId: 'user5',
    userName: '크루즈님',
    userLevel: '리뷰 18',
    rating: 4,
    date: '7일 전',
    reviewCount: 18,
    visitCount: 68,
    guestCount: 18,
    title: '[연박 3-4 밤기] 스탠다드 시티뷰',
    content: '휴지나 샴푸그, 위에 야경이 좋습니다. 송상셔도 나름 징앗고 친절합니다 에어컨도 생각보다 잘 나와서 좋았고 음료서비스도 좋았네요- 순속이 어나드로 어느작에 같덕 새엷응격을 모아, 불 내일 심줄을 직시 카듬소도 어나드로 이녀다로 처음이 셋강하세 음 진신하다로 거기 가오기른 음역분이 마무셔 기어있습니다.',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop'
    ],
    helpful: 3,
    roomType: '[연박 3-4 밤기] 스탠다드 시티뷰',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review6',
    userId: 'user6',
    userName: '여행세니',
    userLevel: '리뷰 45',
    rating: 5,
    date: '5일 전',
    reviewCount: 45,
    visitCount: 120,
    guestCount: 32,
    title: '프리미엄 디럭스 더블 바다전망',
    content: '바다 전망이 정말 멋있었어요! 아침에 일어나서 바다를 보니 힐링이 되었습니다. 직원분들도 친절하시고 조식도 맛있었어요. 가격 대비 정말 만족스러운 숙박이었습니다.',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop'
    ],
    helpful: 2,
    roomType: '프리미엄 디럭스 더블 바다전망',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review7',
    userId: 'user7',
    userName: '김여행자',
    userLevel: '리뷰 12',
    rating: 3,
    date: '3일 전',
    reviewCount: 12,
    visitCount: 25,
    guestCount: 8,
    title: '디럭스 더블 룸',
    content: '위치는 좋았는데 방이 조금 작았어요. 그래도 깨끗하고 필요한 건 다 있어서 나쁘지 않았습니다.',
    images: [],
    helpful: 0,
    roomType: '디럭스 더블 룸',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 'review8',
    userId: 'user8',
    userName: '호텔러버',
    userLevel: '리뷰 89',
    rating: 5,
    date: '1일 전',
    reviewCount: 89,
    visitCount: 234,
    guestCount: 67,
    title: '[TIME SALE Room only] 디럭스 패밀리 트윈',
    content: '타임세일로 정말 저렴하게 좋은 방에서 숙박했어요. 가족 여행에 딱 맞는 넓은 방이었고 아이들도 너무 좋아했습니다. 다음에도 이용하고 싶어요!',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    ],
    helpful: 5,
    roomType: '[TIME SALE Room only] 디럭스 패밀리 트윈',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face'
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
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=400&fit=crop',
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
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        ],
        additionalInfo: '기준 2인, 최대 상위 2인 시 추가 12세 미만 어린이 1인 / 침대 추가 불가',
        facilities: ['기준정보', '추가정보']
      }
    ]
  },
  {
    id: '2',
    name: '파리의 방',
    category: '아파트 전체',
    distance: '1.5km',
    location: '파리의 방',
    rating: 4.99,
    reviewCount: 147,
    price: 229919,
    originalPrice: 459837,
    isRecommended: false,
    amenities: ['wifi', 'parking', 'beach', 'restaurant'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop',
    address: '부산광역시 해운대구 해운대해변로 296',
    phone: '051-234-5678',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    host: {
      name: 'Thomas',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      isHost: true
    },
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    ],
    reviews: mockReviews.slice(0, 5),
    rooms: [
      {
        id: 'room2-1',
        name: '프리미엄 디럭스 더블 바다전망',
        description: '조식PKG★조식뷔페 2인 + 미니바 무료, 발코니있음',
        roomType: '더블 침대 1개',
        maxGuests: 3,
        standardGuests: 2,
        bedType: '더블 침대 1개',
        size: '32㎡',
        hourlyRate: 280000,
        originalHourlyRate: 350000,
        overnightRate: 180000,
        amenities: ['wifi', 'parking', 'balcony', 'oceanview'],
        availableRooms: 3,
        isTimeSale: false,
        cancellationPolicy: '무료취소 가능',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        breakfast: {
          included: true,
          price: 0,
          description: '조식포함(2인)'
        },
        roomFeatures: ['바다 전망', '발코니', '조식뷔페 2인'],
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        ],
        additionalInfo: '기준 2인, 최대 3인',
        facilities: ['기준정보', '추가정보']
      }
    ]
  },
  {
    id: '3',
    name: '파리의 방',
    category: '개인실',
    distance: '2.1km',
    location: '파리의 방',
    rating: 5.0,
    reviewCount: 17,
    price: 164149,
    originalPrice: 328298,
    isRecommended: true,
    amenities: ['wifi', 'parking', 'restaurant', 'fitness'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    address: '서울특별시 중구 명동길 123',
    phone: '02-3456-7890',
    checkInTime: '15:00',
    checkOutTime: '12:00',
    host: {
      name: '김민수',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      isHost: true
    },
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
    ],
    reviews: mockReviews.slice(0, 3),
    rooms: [
      {
        id: 'room3-1',
        name: '디럭스 더블 룸',
        description: '시내 중심가 위치, 쇼핑몰 인접',
        roomType: '더블 침대 1개',
        maxGuests: 3,
        standardGuests: 2,
        bedType: '더블 침대 1개',
        size: '25㎡',
        hourlyRate: 180000,
        originalHourlyRate: 220000,
        overnightRate: 120000,
        amenities: ['wifi', 'parking', 'cityview'],
        availableRooms: 2,
        isTimeSale: false,
        cancellationPolicy: '무료취소 가능',
        checkInTime: '15:00',
        checkOutTime: '12:00',
        breakfast: {
          included: false,
          price: 28000,
          description: '조식 불포함'
        },
        roomFeatures: ['시내 중심가', '쇼핑몰 인접'],
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        ],
        additionalInfo: '기준 2인, 최대 3인',
        facilities: ['기준정보', '추가정보']
      }
    ]
  },
  {
    id: '4',
    name: '경주 불국사 힐링 리조트',
    category: '24% 할인',
    distance: '4.5km',
    location: '경북 경주시',
    rating: 8.8,
    reviewCount: 2134,
    price: 290000,
    originalPrice: 380000,
    isRecommended: false,
    amenities: ['wifi', 'parking', 'spa', 'temple', 'nature'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop',
    address: '강원도 강릉시 창해로 351',
    phone: '033-456-7890',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    host: {
      name: '이서준',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      isHost: true
    },
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop',
    ],
    reviews: mockReviews.slice(0, 4),
    rooms: [
      {
        id: 'room4-1',
        name: '오션뷰 디럭스 더블',
        description: '바다 전망, 스파 이용권 포함',
        roomType: '더블 침대 1개',
        maxGuests: 2,
        standardGuests: 2,
        bedType: '더블 침대 1개',
        size: '35㎡',
        hourlyRate: 320000,
        originalHourlyRate: 450000,
        overnightRate: 200000,
        amenities: ['wifi', 'parking', 'oceanview', 'spa'],
        availableRooms: 2,
        isTimeSale: false,
        cancellationPolicy: '무료취소 가능',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        breakfast: {
          included: false,
          price: 30000,
          description: '조식 불포함'
        },
        roomFeatures: ['바다 전망', '스파 이용권', '대형 발코니'],
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
        ],
        additionalInfo: '기준 2인, 최대 2인',
        facilities: ['기준정보']
      }
    ]
  },
  {
    id: '5',
    name: '속초 설악 마운틴 리조트',
    category: '27% 할인',
    distance: '5.1km',
    location: '강원도 속초시',
    rating: 8.9,
    reviewCount: 1765,
    price: 350000,
    originalPrice: 480000,
    isRecommended: false,
    amenities: ['wifi', 'parking', 'cultural', 'ondol'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=400&fit=crop',
    address: '전라북도 전주시 완산구 한옥마을길 42',
    phone: '063-234-5678',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    host: {
      name: '박지영',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      isHost: true
    },
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
    ],
    reviews: mockReviews.slice(0, 6),
    rooms: [
      {
        id: 'room5-1',
        name: '한옥 스타일 더블',
        description: '전통 한옥 분위기, 온돌 침실',
        roomType: '더블 침대 1개',
        maxGuests: 2,
        standardGuests: 2,
        bedType: '더블 침대 1개',
        size: '20㎡',
        hourlyRate: 150000,
        originalHourlyRate: 200000,
        overnightRate: 100000,
        amenities: ['wifi', 'parking', 'cultural', 'ondol'],
        availableRooms: 3,
        isTimeSale: false,
        cancellationPolicy: '무료취소 가능',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        breakfast: {
          included: true,
          price: 0,
          description: '한식 조식 포함'
        },
        roomFeatures: ['전통 한옥', '온돌 침실', '한식 조식'],
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        ],
        additionalInfo: '기준 2인, 최대 2인',
        facilities: ['기준정보']
      }
    ]
  },
  {
    id: '6',
    name: '광주 무등산 리조트',
    category: '21% 할인',
    distance: '6.8km',
    location: '광주 동구',
    rating: 8.6,
    reviewCount: 1432,
    price: 270000,
    originalPrice: 340000,
    isRecommended: false,
    amenities: ['wifi', 'parking', 'marina', 'restaurant', 'spa'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
    address: '전라남도 여수시 엑스포로 1',
    phone: '061-567-8901',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    host: {
      name: '최영희',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=32&h=32&fit=crop&crop=face',
      isHost: true
    },
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop',
    ],
    reviews: mockReviews.slice(0, 5),
    rooms: [
      {
        id: 'room6-1',
        name: '마리나뷰 프리미엄',
        description: '마리나 전망, 야경 최고',
        roomType: '더블 침대 1개',
        maxGuests: 3,
        standardGuests: 2,
        bedType: '더블 침대 1개',
        size: '30㎡',
        hourlyRate: 250000,
        originalHourlyRate: 320000,
        overnightRate: 180000,
        amenities: ['wifi', 'parking', 'marina', 'nightview'],
        availableRooms: 4,
        isTimeSale: false,
        cancellationPolicy: '무료취소 가능',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        breakfast: {
          included: false,
          price: 32000,
          description: '조식 불포함'
        },
        roomFeatures: ['마리나 전망', '야경 명소', '넓은 발코니'],
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        ],
        additionalInfo: '기준 2인, 최대 3인',
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
  lat: 37.5665 + (index * 0.01),
  lng: 126.9780 + (index * 0.01),
}));

export default function Home() {
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

  if (viewMode === 'reviews' && selectedMotel) {
    return (
      <ReviewsPage
        motel={selectedMotel}
        reviews={selectedMotel.reviews}
        onBack={handleBackToDetail}
      />
    );
  }

  if (viewMode === 'booking' && selectedMotel && bookingData && selectedRoom) {
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

  if (viewMode === 'detail' && selectedMotel) {
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
              onToggleExpand={() => setIsMapExpanded(!isMapExpanded)}
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