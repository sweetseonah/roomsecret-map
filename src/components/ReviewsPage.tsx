import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Star, ChevronDown, ThumbsUp, Camera, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';

interface Review {
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
}

interface Motel {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

interface ReviewsPageProps {
  motel: Motel;
  reviews: Review[];
  onBack: () => void;
}

const ITEMS_PER_PAGE = 10;
const MOBILE_ITEMS_PER_LOAD = 5;

export function ReviewsPage({ motel, reviews, onBack }: ReviewsPageProps) {
  const [sortBy, setSortBy] = useState<'latest' | 'rating' | 'helpful'>('latest');
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate more reviews for demonstration (total 50 reviews)
  const generateMoreReviews = useCallback(() => {
    const extraReviews: Review[] = [];
    const baseReviews = reviews;
    const baseTimestamp = Date.now();
    
    // Additional user names for variety
    const additionalUserNames = [
      '여행좋아', '호텔마니아', '깔끔한여행자', '가성비킹', '여행중독자',
      '힐링여행', '커플여행', '가족여행', '출장러', '백패커',
      '럭셔리러버', '경제적여행', '리뷰어', '여행블로거', '호캉스',
      '주말여행', '야경러버', '맛집탐방', '사진작가', '휴식러',
      '재방문예정', '강력추천', '만족고객', '단골손님', '여행전문가',
      '깐깐한리뷰', '솔직후기', '여행애호가', '숙박달인', '여행기록',
      '휴가중', '여행일기', '방문후기', '투숙후기', '여행메모',
      '리뷰쓰는사람', '여행상식', '숙박정보', '여행팁', '호텔후기',
      '여행다니는사람', '휴식여행'
    ];

    const roomTypes = [
      '[선착순특가] 체크인 시 배정',
      '비즈니스 트윈',
      '디럭스 더블 룸',
      '프리미엄 디럭스 더블 바다전망',
      '프리미엄 디럭스 더블 시티전망',
      '[TIME SALE Room only] 디럭스 패밀리 트윈',
      '[2인 조식 포함] 디럭스 패밀리 트윈',
      '스탠다드 시티뷰',
      '슈페리어 킹',
      '비즈니스 스위트'
    ];

    const reviewContents = [
      '깔끔하고 위치도 좋았어요. 직원분들도 친절하시고 다음에 또 오고 싶습니다.',
      '가격 대비 만족스러운 숙박이었습니다. 조식도 맛있었고 시설도 깨끗했어요.',
      '방이 넓고 편안했습니다. 주변에 맛집도 많아서 좋았어요.',
      '교통이 편리하고 시설이 현대적이에요. 비즈니스 출장에 딱 좋습니다.',
      '바다 전망이 정말 좋아요. 아침에 보는 일출이 최고였습니다.',
      '가족 여행으로 왔는데 아이들이 너무 좋아했어요. 수영장도 깨끗하고 좋았습니다.',
      '호텔 로비부터 고급스러웠어요. 서비스도 만족스럽고 재방문 의사 있습니다.',
      '조용하고 편안한 분위기였어요. 휴식을 취하기에 완벽한 곳이었습니다.',
      '위치가 최고예요. 쇼핑이나 관광지 접근이 너무 편리했습니다.',
      '커플 여행으로 왔는데 로맨틱한 분위기가 좋았어요. 야경도 예뻤습니다.',
      '출장으로 자주 오는데 항상 만족스러워요. 와이파이도 빠르고 업무하기 좋습니다.',
      '조식 뷔페가 정말 맛있었어요. 종류도 다양하고 신선했습니다.',
      '방 크기도 적당하고 침구도 편안했어요. 숙면을 취할 수 있었습니다.',
      '체크인 과정이 빠르고 간편했어요. 직원분들이 매우 친절하셨습니다.',
      '주차장도 넓고 편리했어요. 차로 여행 오시는 분들께 추천합니다.',
      '온천이나 스파 시설도 좋았어요. 여행 피로를 완전히 풀 수 있었습니다.',
      '룸서비스도 빠르고 맛있었어요. 늦은 시간까지 주문 가능해서 좋았습니다.',
      '방 청소 상태가 완벽했어요. 수건이나 어메니티도 깨끗하고 충분했습니다.',
      '호텔 주변 환경이 조용하고 안전했어요. 밤에 산책하기도 좋았습니다.',
      '가격이 저렴한 편인데 서비스는 고급 호텔 수준이었어요.'
    ];

    const userLevels = [
      '리뷰 1', '리뷰 2', '리뷰 3', '리뷰 5', '리뷰 8', '리뷰 12',
      '리뷰 15', '리뷰 20', '리뷰 25', '리뷰 30', '리뷰 45', '리뷰 67',
      '리뷰 89', '베스트리뷰', '골드리뷰', '실버리뷰'
    ];
    
    for (let i = 0; i < 42; i++) {
      const baseReview = baseReviews[i % baseReviews.length];
      // Generate unique ID using timestamp and index to avoid conflicts
      const uniqueId = `generated_review_${baseTimestamp}_${i}`;
      
      extraReviews.push({
        ...baseReview,
        id: uniqueId,
        userName: additionalUserNames[i % additionalUserNames.length],
        userLevel: userLevels[Math.floor(Math.random() * userLevels.length)],
        content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
        date: `${Math.floor(Math.random() * 30) + 1}일 전`,
        rating: Math.floor(Math.random() * 5) + 1,
        helpful: Math.floor(Math.random() * 10),
        roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
        reviewCount: Math.floor(Math.random() * 50) + 1,
        visitCount: Math.floor(Math.random() * 100) + 1,
        guestCount: Math.floor(Math.random() * 20) + 1,
        images: Math.random() > 0.7 ? [baseReview.images[0]] : [], // 30% chance of having images
        avatar: `https://images.unsplash.com/photo-${1472099645785 + i}?w=40&h=40&fit=crop&crop=face`
      });
    }
    return [...reviews, ...extraReviews];
  }, [reviews]);

  const allReviews = generateMoreReviews();

  // Filter and sort reviews
  const getFilteredAndSortedReviews = useCallback(() => {
    let filtered = allReviews;

    // Apply filter
    if (filterBy !== 'all') {
      const targetRating = parseInt(filterBy);
      filtered = allReviews.filter(review => review.rating === targetRating);
    }

    // Apply sort
    switch (sortBy) {
      case 'latest':
        filtered = [...filtered].sort((a, b) => {
          const getDaysAgo = (dateStr: string) => {
            const match = dateStr.match(/(\d+)일 전/);
            return match ? parseInt(match[1]) : 0;
          };
          return getDaysAgo(a.date) - getDaysAgo(b.date);
        });
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'helpful':
        filtered = [...filtered].sort((a, b) => b.helpful - a.helpful);
        break;
    }

    return filtered;
  }, [allReviews, sortBy, filterBy]);

  const filteredReviews = getFilteredAndSortedReviews();

  // Mobile infinite scroll
  useEffect(() => {
    if (isMobile) {
      const initialLoad = filteredReviews.slice(0, MOBILE_ITEMS_PER_LOAD);
      setDisplayedReviews(initialLoad);
      setHasMore(initialLoad.length < filteredReviews.length);
    }
  }, [isMobile, filteredReviews]);

  // Desktop pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const loadMoreReviews = () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const currentLength = displayedReviews.length;
      const nextBatch = filteredReviews.slice(
        currentLength,
        currentLength + MOBILE_ITEMS_PER_LOAD
      );
      
      setDisplayedReviews(prev => [...prev, ...nextBatch]);
      setHasMore(currentLength + nextBatch.length < filteredReviews.length);
      setIsLoading(false);
    }, 500);
  };

  // Infinite scroll handler
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreReviews();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedReviews, hasMore, isLoading, isMobile]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-accent-500 text-accent-500'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderReviewCard = (review: Review) => {
    const isExpanded = expandedReviews.has(review.id);
    const shouldTruncate = review.content.length > 150;

    return (
      <Card key={review.id} className="p-6 hover:shadow-sm transition-shadow">
        <div className="space-y-4">
          {/* User Info and Rating */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <img
                src={review.avatar}
                alt={review.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">{review.userName}</span>
                  <Badge variant="secondary" className="text-xs">
                    {review.userLevel}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>리뷰 {review.reviewCount}</span>
                  <span>·</span>
                  <span>시전 {review.visitCount}</span>
                  <span>·</span>
                  <span>정수 {review.guestCount}</span>
                </div>
              </div>
            </div>
            
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-2xl">⋯</span>
            </button>
          </div>

          {/* Rating Stars */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm text-gray-600">{review.date}</span>
          </div>

          {/* Room Type */}
          <div className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-md inline-block">
            {review.roomType}
          </div>

          {/* Review Content */}
          <div>
            <p className="text-gray-700 leading-relaxed">
              {shouldTruncate && !isExpanded 
                ? review.content.slice(0, 150) + '...'
                : review.content
              }
              {shouldTruncate && (
                <button
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="text-primary-600 hover:text-primary-700 ml-2 font-medium"
                >
                  {isExpanded ? '접기' : '더보기'}
                </button>
              )}
            </p>
          </div>

          {/* Review Images */}
          {review.images.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto">
              {review.images.map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={`리뷰 사진 ${index + 1}`}
                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  {index === 0 && review.images.length > 1 && (
                    <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded px-1">
                      <Camera className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Helpful Button */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              이 리뷰가 도움이 되었나요?
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-primary-600 flex items-center space-x-1"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{review.helpful}</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const reviewsToShow = isMobile ? displayedReviews : paginatedReviews;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
              <div>
                <h1 className="font-semibold text-gray-900">호텔 리뷰</h1>
                <div className="flex items-center space-x-2 text-sm text-primary-600">
                  <span>7.11 - 7.12</span>
                  <span>·</span>
                  <span>1박 2일</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <span className="text-lg">↗</span>
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <span className="text-lg">♡</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Rating Summary */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Star className="h-8 w-8 fill-accent-500 text-accent-500" />
            <span className="text-4xl font-bold text-gray-900">{motel.rating}</span>
            <span className="text-gray-600">{motel.reviewCount.toLocaleString()}개 평가</span>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">필터</span>
            </div>
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="5">⭐ 5점</SelectItem>
                <SelectItem value="4">⭐ 4점</SelectItem>
                <SelectItem value="3">⭐ 3점</SelectItem>
                <SelectItem value="2">⭐ 2점</SelectItem>
                <SelectItem value="1">⭐ 1점</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">정렬</span>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="rating">평점순</SelectItem>
                <SelectItem value="helpful">도움순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsToShow.map(renderReviewCard)}
        </div>

        {/* Mobile Load More */}
        {isMobile && hasMore && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMoreReviews}
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isLoading ? '로딩 중...' : '더보기'}
            </Button>
          </div>
        )}

        {/* Desktop Pagination */}
        {!isMobile && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent className="flex items-center space-x-1">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* No Reviews Message */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">해당 조건의 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}