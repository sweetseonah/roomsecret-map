declare namespace kakao {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setBounds(bounds: LatLngBounds): void;
      getBounds(): LatLngBounds;
      setCenter(latlng: LatLng): void;
      setMaxLevel(latlng: LatLng): void;
      getCenter(): LatLng;
      addControl(control: any, position: any): void;
      relayout(): void;
    }
    interface MapOptions {
      center: LatLng;
      level: number;
    }
    class LatLngBounds {
      extend(latlng: LatLng): void;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
    }
    interface BoundsSwNe {
      ha: number; //지도 좌측하단 위도
      qa: number; //지도 좌측 하단 경도
      oa: number; //지도 우측 상단 위도
      pa: number; //지도 우측 상단 경도
    }
    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }
    interface MarkerOptions {
      map: Map;
      position: LatLng;
      title?: string;
    }
    namespace services {
      class Geocoder {
        addressSearch(
          address: string,
          callback: (result: AddressSearchResult[], status: string) => void,
        ): void;
      }
      interface AddressSearchResult {
        x: string;
        y: string;
      }
      const Status: {
        OK: string;
      };
    }
    class MapTypeControl {}
    class ZoomControl {}
    namespace ControlPosition {
      const TOPRIGHT: any;
      const RIGHT: any;
    }
    namespace event {
      function addListener(
        target: any,
        type: string,
        callback: () => void,
      ): void;
    }
    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }
  }
}
