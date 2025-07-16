import { CompanyNews } from '@/types/apis/company/companyInfo';

export type ListItem = {
  title: string;
  pubDate: string;
  link: string;
  originallink: string;
  description: string;
};

export interface SimpleListProps {
  list: CompanyNews[] | null;
}
