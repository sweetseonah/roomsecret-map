import Image from 'next/image'

interface MotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  discount?: number;
  isAvailable: boolean;
  onClick: () => void;
}

export function MotelCard({
  id,
  name,
  location,
  price,
  rating,
  image,
  discount,
  isAvailable,
  onClick
}: MotelCardProps) {
  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        {discount && (
          <div className="absolute top-2 right-2 bg-accent-500 text-accent-foreground px-2 py-1 rounded-md text-sm font-medium">
            {discount}% 할인
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">예약 불가</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-foreground mb-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-2">{location}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400 text-sm mr-1">★</span>
            <span className="text-sm text-foreground">{rating}</span>
          </div>
          
          <div className="text-right">
            {discount && price && (
              <p className="text-muted-foreground text-sm line-through">
                {price.toLocaleString()}원
              </p>
            )}
            <p className="text-primary-600 font-medium">
              {price && discount 
                ? Math.floor(price * (1 - discount / 100)).toLocaleString()
                : price?.toLocaleString() || '0'
              }원
            </p>
          </div>
        </div>
        
        <button 
          className={`w-full mt-3 px-4 py-2 rounded-md font-medium transition-colors ${
            isAvailable 
              ? 'bg-primary-500 text-primary-foreground hover:bg-primary-600' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          disabled={!isAvailable}
        >
          {isAvailable ? '예약하기' : '예약 불가'}
        </button>
      </div>
    </div>
  );
}