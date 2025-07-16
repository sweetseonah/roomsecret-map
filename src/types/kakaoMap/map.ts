export interface AddressSearchResult {
  address_name: string;
  y: string; // Latitude as a string
  x: string; // Longitude as a string
}

export interface Latlng {
  latitude: number; // 위도
  longitude: number; // 경도
}
