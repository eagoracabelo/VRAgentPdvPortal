import { IOption } from '@vrsoftbr/vr-file-export/config/export-config';
import { TableColumn } from './../types/table-column.type';

export interface IExportAll {
  options: IOption;
  columns: TableColumn[];
  summaryColumns: string[];
  groupsKeysMapped: string[];
}
