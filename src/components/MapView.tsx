import { useState } from 'react';
import { MapPin, Maximize2, Minimize2, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MapMarker {
  id: string;
  name: string;
  price: number;
  lat: number;
  lng: number;
  isSelected?: boolean;
}

interface MapViewProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isMobile?: boolean;
  selectedMotelId?: string | null;
}

export function MapView({ 
  markers, 
  onMarkerClick, 
  isExpanded, 
  onToggleExpand, 
  isMobile,
  selectedMotelId 
}: MapViewProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const mapHeight = isMobile ? 'h-full' : isExpanded ? 'h-screen' : 'h-64 md:h-96';

  return (
    <Card className={`relative bg-gradient-to-br from-slate-50 to-primary-50 transition-all duration-300 ${mapHeight}`}>
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-primary-100 rounded-lg">
        {/* Simulated map markers */}
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          {markers.map((marker, index) => {
            const isSelected = marker.isSelected || marker.id === selectedMotelId;
            return (
              <div
                key={marker.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 touch-manipulation"
                style={{
                  left: `${30 + (index * 15) % 60}%`,
                  top: `${40 + (index * 10) % 40}%`,
                }}
                onMouseEnter={() => setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
                onClick={() => onMarkerClick(marker.id)}
              >
                {/* Price marker */}
                <div className={`relative ${
                  isSelected ? 'z-20' : 'z-10'
                }`}>
                  <div className={`
                    px-2 sm:px-3 py-1 rounded-full shadow-lg transition-all duration-200 min-h-[32px] flex items-center border
                    ${isSelected 
                      ? 'bg-primary-600 text-white scale-110 border-primary-700' 
                      : 'bg-white text-gray-900 hover:scale-105 active:scale-95 hover:bg-primary-50 hover:border-primary-300 border-gray-200'
                    }
                    ${hoveredMarker === marker.id ? 'shadow-xl' : ''}
                  `}>
                    <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                      ₩{(marker.price / 1000).toFixed(0)}k
                    </span>
                  </div>
                  
                  {/* Marker pin */}
                  <div className={`
                    absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0
                    border-l-4 border-r-4 border-t-6 border-transparent
                    ${isSelected ? 'border-t-primary-600' : 'border-t-white'}
                  `} />
                  
                  {/* Hover card */}
                  {hoveredMarker === marker.id && !isMobile && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-30">
                      <Card className="p-2 whitespace-nowrap shadow-lg border-primary-200">
                        <p className="font-semibold text-sm">{marker.name}</p>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map overlay text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-secondary-500">
            <MapPin className="h-8 sm:h-12 w-8 sm:w-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm sm:text-lg opacity-50 px-4">지도 영역 (실제 환경에서는 Kakao Map API)</p>
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary-50 hover:text-primary-600"
        >
          <Navigation className="h-4 w-4" />
        </Button>
        
        {onToggleExpand && !isMobile && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleExpand}
            className="bg-white shadow-lg h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-primary-50 hover:text-primary-600"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Results count - 모바일에서는 숨김 */}
      {!isMobile && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2">
          <Button className="bg-secondary-700 hover:bg-secondary-800 text-white shadow-lg text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-10">
            이 지역 검색 결과 {markers.length}개
          </Button>
        </div>
      )}
    </Card>
  );
}