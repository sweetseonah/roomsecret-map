import axios, { AxiosRequestConfig } from 'axios';

import {
  CityCodes,
  CompanyParams,
  CompanyRadiusParams,
  FranchiseCompanyResult,
  LocationCodes,
  FranchiesRadiusParams,
  AllFranchiseParam,
  AllFranchiseResult,
} from '@/types/apis/franchise/location';

//const labUrl = 'http://lab.ipnow.co.kr';
const devMode = false;


const getApiUrl = () => {
  return devMode
    ? 'http://ipnow.io/xapi/roomsecret'
    : 'http://lab.ipnow.co.kr/xapi/roomsecret';
};

/**
 *
 * @returns 시/군 리스트
 */
export const getCityCode = async (): Promise<CityCodes> => {
  try {
    const res = await axios.get(`${getApiUrl()}/get_city_code`);
    return res.data as CityCodes;
  } catch (error) {
    console.error('Failed to get city code:', error);
    throw error;
  }
};

/**
 *
 * @param city 도시명
 * @returns 해당 도시의 구/군 가져오기
 */
export const getLocationCode = async (city: string): Promise<LocationCodes> => {
  try {
    const res = await axios.get(
      `${getApiUrl()}/get_location_code?city=${city}`,
    );
    return res.data as LocationCodes;
  } catch (error) {
    console.error('Failed to get location code:', error);
    throw error;
  }
};

/**
 *
 * @param param
 * @returns 비가맹점 시/군 기준 리스트
 */
export const getCompany = async (
  param: CompanyParams,
): Promise<FranchiseCompanyResult> => {
  try {
    const config: AxiosRequestConfig = {
      params: param,
    };

    const res = await axios.get(`${getApiUrl()}/get_company`, config);
    return res.data as FranchiseCompanyResult;
  } catch (error) {
    console.error('Failed to get company list:', error);
    throw error;
  }
};

/**
 *
 * @param param
 * @returns 가맹점을 시 기준으로 조회
 */
export const getFranchises = async (
  param: CompanyParams,
): Promise<FranchiseCompanyResult> => {
  try {
    const config: AxiosRequestConfig = {
      params: param,
    };

    const res = await axios.get(`${getApiUrl()}/get_franchies`, config);
    return res.data as FranchiseCompanyResult;
  } catch (error) {
    console.error('Failed to get franchies list:', error);
    throw error;
  }
};

/**
 *
 * @param param
 * @returns 비가맹점 반경 기준 리스트
 */
export const getCompanyRadius = async (
  param: CompanyRadiusParams,
): Promise<FranchiseCompanyResult> => {
  try {
    const config: AxiosRequestConfig = {
      params: param,
    };

    const res = await axios.get(`${getApiUrl()}/get_company_radius`, config);
    return res.data as FranchiseCompanyResult;
  } catch (error) {
    console.error('Failed to get company list:', error);
    throw error;
  }
};

/**
 *
 * @param param
 * @returns 가맹점 반경 기준 리스트
 */
export const getFranchiesRadius = async (
  param: FranchiesRadiusParams,
): Promise<FranchiseCompanyResult> => {
  try {
    const config: AxiosRequestConfig = {
      params: param,
    };

    const res = await axios.get(`${getApiUrl()}/get_franchies_radius`, config);
    return res.data as FranchiseCompanyResult;
  } catch (error) {
    console.error('Failed to get company list:', error);
    throw error;
  }
};

export const getFranchiesAll = async (param: AllFranchiseParam) => {
  try {
    const config: AxiosRequestConfig = {
      params: param,
    };

    const res = await axios.get(`${getApiUrl()}/get_franchies_all`, config);
    return res.data as AllFranchiseResult;
  } catch (error) {
    console.error('Failed to get all list:', error);
    throw error;
  }
};
