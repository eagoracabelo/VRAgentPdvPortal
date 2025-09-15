import { SortDirection } from './../types/sort-direction.type';

export interface ISort {
  column?: string | number | boolean | unknown;
  dir?: SortDirection;
}
