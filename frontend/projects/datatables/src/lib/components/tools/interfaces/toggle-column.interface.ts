import { IStorageColumn } from './../../../interfaces/storage-column.interface';
import { TableColumn } from './../../../types/table-column.type';

export interface IToggleColumn {
  columns: TableColumn[];
  storage: IStorageColumn[];
}
