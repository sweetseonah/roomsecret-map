import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

interface RoomImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  roomName: string;
  initialIndex?: number;
}

export function RoomImageGallery({ 
  isOpen, 
  onClose, 
  images, 
  roomName, 
  initialIndex = 0 
}: RoomImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset current index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextImage();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex, images.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black border-0">
        {/* Hidden accessibility elements */}
        <DialogTitle className="sr-only">
          {roomName} 사진 갤러리 - {currentIndex + 1}번째 사진 / 총 {images.length}장
        </DialogTitle>
        <DialogDescription className="sr-only">
          {roomName}의 객실 사진을 보고 있습니다. 좌우 화살표 키로 이동하거나 하단 썸네일을 클릭하여 다른 사진을 볼 수 있습니다.
        </DialogDescription>

        {/* Header - positioned absolutely */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-xl">{roomName}</h3>
              <p className="text-sm text-gray-300 mt-1">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-full"
              aria-label="갤러리 닫기"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Image Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={images[currentIndex]}
            alt={`${roomName} - ${currentIndex + 1}번째 사진`}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/75 rounded-full h-12 w-12 p-0 transition-all duration-200"
                aria-label="이전 사진"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/75 rounded-full h-12 w-12 p-0 transition-all duration-200"
                aria-label="다음 사진"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image Counter Indicator */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded-lg text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="flex justify-center">
              <div className="flex space-x-2 overflow-x-auto max-w-full">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent hover:border-gray-400 hover:scale-105'
                    }`}
                    aria-label={`${index + 1}번째 사진으로 이동`}
                  >
                    <img
                      src={image}
                      alt={`${roomName} 썸네일 ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Navigation Hint */}
        <div className="absolute top-24 right-6 text-white text-sm bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm">
          <p className="flex items-center space-x-2">
            <span>←</span>
            <span>→</span>
            <span>키로 이동</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}