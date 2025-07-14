import { Star, MapPin, Phone, Clock, Users, Car, Wifi } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MotelDetailHeaderProps {
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
}

export function MotelDetailHeader({
  name,
  category,
  rating,
  reviewCount,
  address,
  phone,
  checkInTime,
  checkOutTime,
  amenities,
  isRecommended
}: MotelDetailHeaderProps) {
  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    family: Users,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{name}</h1>
            {isRecommended && (
              <Badge className="bg-pink-600 text-white">추천</Badge>
            )}
          </div>
          <p className="text-gray-600 mb-2">{category}</p>
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-current" />
            <span className="font-semibold text-lg">{rating}</span>
          </div>
          <span className="text-gray-500">({reviewCount}개 후기)</span>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-600">
          예약가능
        </Badge>
      </div>

      {/* Location and Contact */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">체크인 {checkInTime} / 체크아웃 {checkOutTime}</span>
        </div>
      </div>

      {/* Amenities */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">편의시설</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenities.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
            return (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>
                  {amenity === 'wifi' && 'Wi-Fi'}
                  {amenity === 'parking' && '주차장'}
                  {amenity === 'family' && '가족실'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}