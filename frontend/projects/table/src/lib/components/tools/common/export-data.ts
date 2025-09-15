import { PrintType } from './types';

export interface IExportData {
  printType?: PrintType;
  printColumns: string[];
}

export class ExportPrintData implements IExportData {
  printType = undefined;
  printPageType = undefined;
  printColumns = [];

  constructor(value: IExportData) {
    Object.assign(this, { ...value });
  }
}
