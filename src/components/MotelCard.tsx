import Image from 'next/image'
import { Heart } from 'lucide-react'

interface Motel {
  id: string;
  name: string;
  category?: string;
  distance?: string;
  location: string;
  rating: number;
  reviewCount?: number;
  price: number;
  originalPrice?: number;
  isRecommended?: boolean;
  amenities?: string[];
  isAvailable: boolean;
  imageUrl?: string;
  images?: string[];
  image?: string;
  discount?: number;
  host?: {
    name: string;
    avatar: string;
    isHost: boolean;
  };
}

interface MotelCardProps {
  motel: Motel;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (event: React.MouseEvent) => void;
  isMobile?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
}

export function MotelCard({
  motel,
  onClick,
  isFavorite = false,
  onToggleFavorite,
  isMobile = false,
  isSelected = false,
  isHovered = false
}: MotelCardProps) {
  const imageUrl = motel.imageUrl || motel.image || (motel.images && motel.images[0]) || '';
  const discount = motel.originalPrice && motel.price 
    ? Math.round(((motel.originalPrice - motel.price) / motel.originalPrice) * 100)
    : motel.discount;

  return (
    <div 
      className={`bg-card border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'border-primary-500 shadow-lg ring-2 ring-primary-200' : 
        isHovered ? 'border-primary-300 shadow-md' : 'border-border'
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={imageUrl}
          alt={motel.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          priority={motel.id === '1'} // Add priority for the first motel (LCP)
        />
        
        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        )}
        
        {discount && (
          <div className="absolute top-2 left-2 bg-accent-500 text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
            {discount}% 할인
          </div>
        )}
        {!motel.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">예약 불가</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-foreground mb-1">{motel.name}</h3>
        <p className="text-muted-foreground text-sm mb-2">{motel.location}</p>
        
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center">
            <span className="text-yellow-400 text-sm mr-1">★</span>
            <span className="text-sm text-foreground">{motel.rating}</span>
            {motel.reviewCount && (
              <span className="text-xs text-muted-foreground ml-1">({motel.reviewCount})</span>
            )}
          </div> */}
          
          <div className="text-right">
            {motel.originalPrice && motel.originalPrice !== motel.price && (
              <p className="text-muted-foreground text-sm line-through">
                {motel.originalPrice.toLocaleString()}원
              </p>
            )}
            <p className="text-primary-600 font-medium">
              {motel.price?.toLocaleString() || '0'}원
            </p>
          </div>
        </div>
        
        <button 
          className={`w-full mt-3 px-4 py-2 rounded-md font-medium transition-colors ${
            motel.isAvailable 
              ? 'bg-primary-500 text-primary-foreground hover:bg-primary-600' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          disabled={!motel.isAvailable}
        >
          {motel.isAvailable ? '예약하기' : '예약 불가'}
        </button>
      </div>
    </div>
  );
}