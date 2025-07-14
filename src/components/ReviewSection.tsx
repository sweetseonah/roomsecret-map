import { useState } from 'react';
import { Star, ChevronRight, ThumbsUp, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

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

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  onViewAllReviews: () => void;
}

export function ReviewSection({ rating, reviewCount, reviews, onViewAllReviews }: ReviewSectionProps) {
  const [showFullReview, setShowFullReview] = useState<string | null>(null);

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

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  // Show first 2 reviews for preview
  const previewReviews = reviews.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Review Summary Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="h-6 w-6 fill-accent-500 text-accent-500" />
            <span className="text-2xl font-bold text-gray-900">{rating}</span>
            <span className="text-gray-600">{reviewCount.toLocaleString()}개 평가</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          onClick={onViewAllReviews}
          className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
        >
          <span>더보기</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Review Preview Cards */}
      <div className="space-y-4">
        {previewReviews.map((review) => (
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
                  {showFullReview === review.id 
                    ? review.content 
                    : truncateContent(review.content, 120)
                  }
                  {review.content.length > 120 && (
                    <button
                      onClick={() => setShowFullReview(
                        showFullReview === review.id ? null : review.id
                      )}
                      className="text-primary-600 hover:text-primary-700 ml-2 font-medium"
                    >
                      {showFullReview === review.id ? '접기' : '더보기'}
                    </button>
                  )}
                </p>
              </div>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {review.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={image}
                        alt={`리뷰 사진 ${index + 1}`}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      {index === 3 && review.images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            +{review.images.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center justify-between pt-2">
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
        ))}
      </div>

      {/* Show All Reviews Button */}
      {reviews.length > 2 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={onViewAllReviews}
            className="w-full lg:w-auto px-8 py-3 border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            리뷰 {reviewCount.toLocaleString()}개 모두 보기
          </Button>
        </div>
      )}
    </div>
  );
}