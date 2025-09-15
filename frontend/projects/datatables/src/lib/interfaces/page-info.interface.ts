import { IFiltered } from './filtered.interface';
import { ISort } from './sort.interface';

export interface IPageInfo {
  count?: number;
  filter: IFiltered;
  limit: number;
  offset: number;
  pageSize: number;
  order: ISort;
}
