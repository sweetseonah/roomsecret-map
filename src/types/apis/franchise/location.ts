/**
 * 시/도 리스트
 */
export interface CityCodes {
  total: number; // result 개수
  result: string[]; // 시/도 또는 구/군 리스트
}

/**
 * 구/군
 */
export interface Location {
  location: string;
}

/**
 * 구/군 리스트
 */
export interface LocationCodes {
  total: number; // result 개수
  result: Location[]; // 시/도 또는 구/군 리스트
}

/**
 * 가맹점 리스트 가져올때 파라미터
 */
export interface CompanyParams {
  keyword: string; // 키워드
  city: string; // 도시명
  location: string; // 구/군명
  offset: number; // 페이지수
  limit: number; // 페이지당 개수
}
/**
 * 가맹점 리스트 가져올때 파라미터
 */
export interface FranchiesRadiusParams {
  geo_lat: string | number;
  geo_lng: string | number;
  radius: string; // 반경
  limit: string; // 개수
}
/**
 * 가맹점 리스트 가져올때 파라미터
 */
export interface CompanyRadiusParams {
  geo_lat: string | number;
  geo_lng: string | number;
  radius: string; // 반경
  limit: string; // 개수
}

/**
 * 가맹점 정보보
 */
export interface FranchiseCompany {
  idx: string; // idx
  id: string; // 가맹점 아이디
  company_name: string; // 가맹점명
  company_tel: string; // 가맹점 번호
  company_address: string; // 가맹점 주소
  company_type: string; // 가맹점 업종
  company_location_kr: string; // 가맹점 구/군
  company_city_kr: string; // 가맹점 시/도
  geo_lat: string | null; // 가맹점 위도
  geo_lng: string | null; // 가맹점 경도
}

/**
 * 가맹점 리스트
 */
export interface FranchiseCompanyResult {
  total: string; // 가맹점 리스트 총 개수
  result: FranchiseCompany[]; // 가맹점 리스트
}

/**
 * 모든 가맹점 가져오기 파라미터
 * type:1 - 가맹점
 * type:2 - 비가맹점
 * type:3 - 모두
 */
export interface AllFranchiseParam {
  geo_lat: string | number;
  geo_lng: string | number;
  radius: string | number;
  type: string;
  city: string;
  location: string;
  company_name: string;
}

export interface AllFranchise extends FranchiseCompany {
  distance: string;
}

/**
 * 모든 가맹점 가져오기 결과
 */
export interface AllFranchiseResult {
  total: string;
  result: AllFranchise[];
}
