import { Latlng } from '@/types/kakaoMap/map';
import { useEffect, useState } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState<Latlng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>(
    'prompt',
  );

  useEffect(() => {
    // 권한 상태 확인
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => setPermission(result.state))
        .catch((err) => console.error('Permission check failed', err));
    }

    // 위치 정보 요청
    const getLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setPermission('granted');
        },
        (err) => {
          console.error(err.message);
          setError(err.message);
          setPermission('denied');
        },
      );
    };

    getLocation();
  }, []);

  return { location, error, permission };
}
