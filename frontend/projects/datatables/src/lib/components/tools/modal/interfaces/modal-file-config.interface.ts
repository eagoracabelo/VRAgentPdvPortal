import { PrintPageType } from '@vrsoftbr/vr-file-export/shared/types';
import { TableColumn } from '../../../../types/table-column.type';
import { IColumnPrintingPreference } from '../../interfaces/printing-preference.interface';

export interface IModalFileConfig {
  columns: TableColumn[];
  disableExportAll: boolean;
  exportType: string;
  columnPrintingPreference: IColumnPrintingPreference[] | undefined;
  onlyLandscapeView: boolean;
  preSelectedColumns?: string[];
  printPageType?: PrintPageType;
  eventTrackingIdentifier?: string;
}
