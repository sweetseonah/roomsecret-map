/**
 * 브라우저 환경에서 위치 정보 이벤트 타입 확장
 */
export interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    error: string | null;
  }


