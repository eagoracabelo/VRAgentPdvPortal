export type ExportType = 'pdf' | 'xls' | 'txt';

export const TypesExport: Record<ExportType, ExportType> = {
  pdf: 'pdf',
  xls: 'xls',
  txt: 'txt',
};

export type PrintType = 'portrait' | 'landscape';

export const TypesPrint: Record<PrintType, PrintType> = {
  portrait: 'portrait',
  landscape: 'landscape',
};
