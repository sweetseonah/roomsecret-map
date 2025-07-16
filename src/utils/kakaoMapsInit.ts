// Global Kakao Maps initialization utility
declare global {
  interface Window {
    kakaoMapsReady: boolean;
    kakaoMapsCallbacks: (() => void)[];
  }
}

// Initialize global variables
if (typeof window !== 'undefined') {
  window.kakaoMapsReady = false;
  window.kakaoMapsCallbacks = [];
}

export const initializeKakaoMaps = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    // If already ready, resolve immediately
    if (window.kakaoMapsReady) {
      resolve();
      return;
    }

    // Add to callback queue
    window.kakaoMapsCallbacks.push(() => resolve());

    // Check if Kakao SDK is available
    const checkKakaoSDK = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          window.kakaoMapsReady = true;
          // Execute all waiting callbacks
          window.kakaoMapsCallbacks.forEach(callback => callback());
          window.kakaoMapsCallbacks = [];
        });
      } else {
        // Retry after 100ms
        setTimeout(checkKakaoSDK, 100);
      }
    };

    checkKakaoSDK();
  });
};

export const withKakaoMaps = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  
  if (window.kakaoMapsReady) {
    callback();
  } else {
    initializeKakaoMaps().then(callback);
  }
}; 