import { useState, useEffect } from 'react';

export const useKakaoMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }
      
      // SDK가 아직 로드되지 않았다면 재시도
      setTimeout(checkKakaoMaps, 100);
    };

    checkKakaoMaps();
  }, []);

  const loadMaps = (callback: () => void) => {
    if (!isLoaded) {
      console.warn('Kakao Maps SDK not loaded yet');
      return;
    }

    window.kakao.maps.load(callback);
  };

  return {
    isLoaded,
    isLoading,
    loadMaps
  };
}; 