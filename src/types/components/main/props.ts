import { CompanyNews } from '@/types/apis/company/companyInfo';
import { govBusinessItem, govFields } from '@/types/apis/govBusiness/task';
import { MarketInfoList } from '@/types/apis/marketInfo/market';

/**
 * @name 메인페이지 props
 */
export interface MainPageProps {
  marketInfo: MarketInfoList | null; // 최신 시장정보
  hotBusiness: govBusinessItem[] | []; // 지금 HOT한 지원사업
  fields: govFields | null; // 정부사업 필드
  news: CompanyNews[] | null; // 기업별 NEWS
}
