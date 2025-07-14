import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageGalleryProps {
  images: string[];
  motelName: string;
}

export function ImageGallery({ images, motelName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      {/* Main image */}
      <div className="relative aspect-[4/3] lg:aspect-[16/10] w-full">
        <ImageWithFallback
          src={images[currentIndex]}
          alt={`${motelName} 이미지 ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg h-8 w-8 p-0"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg h-8 w-8 p-0"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* All photos button */}
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white shadow-lg"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              <span className="text-sm">사진 {images.length}장</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
            <div className="relative h-full">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
                onClick={() => setIsGalleryOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 h-full overflow-auto">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-[4/3] cursor-pointer rounded-lg overflow-hidden ${
                      index === currentIndex ? 'ring-2 ring-pink-500' : ''
                    }`}
                    onClick={() => {
                      goToImage(index);
                      setIsGalleryOpen(false);
                    }}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${motelName} 이미지 ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail navigation */}
      <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 ${
              index === currentIndex ? 'border-pink-500' : 'border-gray-200'
            }`}
          >
            <ImageWithFallback
              src={image}
              alt={`${motelName} 썸네일 ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        {images.length > 5 && (
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-600"
          >
            +{images.length - 5}
          </button>
        )}
      </div>

      {/* Image counter */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}