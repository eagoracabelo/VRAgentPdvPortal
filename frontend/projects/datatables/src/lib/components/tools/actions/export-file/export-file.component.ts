import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  input,
  Input,
  OnInit,
  Optional,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {
  exportFromBrowser,
  formatKeyValue,
  IData,
} from '@vrsoftbr/vr-file-export';
import {
  ExportConfig,
  ICurrency,
  IOption,
  ISummary,
} from '@vrsoftbr/vr-file-export/config/export-config';
import { IExportData } from '@vrsoftbr/vr-file-export/shared/export-data';
import {
  ExportType,
  PrintPageType,
  TypesExport,
} from '@vrsoftbr/vr-file-export/shared/types';
import { from, take } from 'rxjs';
import { TranslatorPipeImpl } from '../../../../classes/translator-pipe';

import { ETokens } from '../../../../enums/tokens.enum';
import { IExportAll } from '../../../../interfaces/export-all.interface';
import { Indexeddb } from '../../indexeddb/indexeddb';
import { IColumnPrintingPreference } from '../../interfaces/printing-preference.interface';
import { Modal } from '../../modal/class/modal';
import { FileConfigComponent } from '../../modal/components/file-config/file-config.component';
import { ModalRef } from '../../modal/references/modal-ref';
import { TableColumn } from './../../../../types/table-column.type';
import { TableRow } from './../../../../types/table-row.type';

export interface IFileData {
  [key: string]: string | number | unknown;
}

@Component({
  selector: 'export-file',
  templateUrl: './export-file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportFileComponent implements OnInit {
  @Output() exportAll = new EventEmitter<IExportAll>();
  private _isDatatablesToolsExportOpen = false;

  types = TypesExport;
  fileType!: ExportType;

  openModal = false;

  private _rows!: TableRow[];
  private _columns!: TableColumn[];

  get isDatatablesToolsExportOpen(): boolean {
    return this._isDatatablesToolsExportOpen;
  }

  @Input() set rows(val: TableRow[]) {
    this._rows = val;
  }

  get rows(): TableRow[] {
    return this._rows;
  }

  @Input() groupedRows!: unknown[];

  @Input() disableExportAll!: boolean;

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() fileTitle!: string;

  @Input() onlyLandscapeView!: boolean;

  @Input() preSelectedColumns!: string[];

  @Input() selectedPrintPageType!: PrintPageType;

  @Input() storageKeyColumnPrintingPreference: string | undefined;

  eventTrackingIdentifier = input<string>('');

  refExportFrom = exportFromBrowser;

  private _indexeddb!: Indexeddb;
  private _columnPrintingPreference!: IColumnPrintingPreference[] | undefined;

  constructor(
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    @Optional()
    @Inject(forwardRef(() => ETokens.TRANSLATOR_TOKEN))
    protected readonly _translatorPipe?: TranslatorPipeImpl,
  ) {
    this._indexeddb = new Indexeddb();
  }

  ngOnInit(): void {
    this.loadStorageColumnPrintingPreference();
  }

  private loadStorageColumnPrintingPreference(): void {
    if (this.storageKeyColumnPrintingPreference) {
      this._indexeddb
        .getAllPreferenciaImpressaoByKey(
          this.storageKeyColumnPrintingPreference,
        )
        .then((data) => (this._columnPrintingPreference = data))
        .catch((error) => console.error(`${ExportFileComponent.name}`, error));
    }
  }

  toggleDatatablesToolsExport(): void {
    this._isDatatablesToolsExportOpen = !this._isDatatablesToolsExportOpen;
  }

  setFileType(type: ExportType): void {
    this.fileType = type;
  }

  applyFile(): void {
    if (!this.fileType || this.rows.length === 0) {
      return;
    }

    const msg = this.fileType;

    switch (this.fileType) {
      case 'pdf':
        this.generateFile(
          FileConfigComponent,
          this.fileType,
          undefined,
          this.groupedRows,
        );
        break;
      case 'xls':
        this.generateFile(
          FileConfigComponent,
          this.fileType,
          'planilha',
          this.groupedRows,
        );
        break;
      case 'txt':
        this.generateFile(
          FileConfigComponent,
          this.fileType,
          'arquivo',
          this.groupedRows,
        );
        break;
      default:
        throw new Error(`Can't export unknown data type ${msg}.`);
    }
  }

  private generateFile(
    componentType: Type<unknown>,
    exportType: ExportType,
    name?: string,
    exportByGroupedRows?: unknown[],
  ): void {
    const fileName = `${this.fileTitle.toLowerCase()}-${
      name ?? exportType
    }-${new Date(Date.now()).getTime()}`;

    const componentmodal = this.modalInstance(componentType, exportType);
    const mappedData = (
      exportByGroupedRows as { key: string; value: IFileData[] }[]
    )?.reduce(
      (acc, group) => {
        acc[group.key] = group.value.map((item) => {
          return {
            ...item,
            agrupamento: '',
          };
        });
        return acc;
      },
      {} as Record<string, IFileData[]>,
    );

    componentmodal.afterOk.pipe(take(1)).subscribe((value: IExportData) => {
      const options = Object.assign(new ExportConfig(), {
        ...value,
        fileTitle: this.fileTitle,
        exportType,
        fileName,
      });
      this.printPageOptions(value.printPageType, options, mappedData);

      this.checkColumnPrintingPreference(value).catch((error) =>
        console.error(`${ExportFileComponent.name}`, error),
      );
    });
  }

  private modalInstance(
    componentType: Type<unknown>,
    exportType: string,
  ): ModalRef<IExportData> {
    const modal = new Modal<IExportData>(this.injector, this.viewContainerRef);

    return modal.open(componentType, {
      data: {
        columns: this.removeColumnAcoes(this.columns),
        disableExportAll: this.disableExportAll,
        exportType,
        columnPrintingPreference: this._columnPrintingPreference,
        onlyLandscapeView: this.onlyLandscapeView,
        preSelectedColumns: this.preSelectedColumns,
        printPageType: this.selectedPrintPageType,
        eventTrackingIdentifier: this.eventTrackingIdentifier(),
      },
    });
  }

  private async checkColumnPrintingPreference(
    value: IExportData,
  ): Promise<void> {
    if (
      this._columnPrintingPreference &&
      this.storageKeyColumnPrintingPreference
    ) {
      if (value.printColumns.length === this._columnPrintingPreference.length) {
        const isEqual = value.printColumns.every((column: string) => {
          return this._columnPrintingPreference?.some(
            (preference) => preference.column === column,
          );
        });

        if (isEqual) return;
      }

      await this.deleteAllByKeyAndInsertMany(value);
      this.loadStorageColumnPrintingPreference();
    }
  }

  private async deleteAllByKeyAndInsertMany(value: IExportData): Promise<void> {
    if (this.storageKeyColumnPrintingPreference) {
      const columnsToSave = value.printColumns.map((column: string) => {
        return {
          key: this.storageKeyColumnPrintingPreference as string,
          column,
        };
      });
      await this._indexeddb.deleteAllByKeyAndInsertMany(
        this.storageKeyColumnPrintingPreference,
        columnsToSave,
      );
    }
  }

  private removeColumnAcoes(columns: TableColumn[]): TableColumn[] {
    return columns.filter((column) => column.prop !== 'acoes');
  }

  private printPageOptions(
    type: PrintPageType,
    options: IOption,
    groupedMappedData?: Record<string, IFileData[]>,
  ): void {
    if (groupedMappedData && options.printColumns) {
      (options.printColumns as string[]).unshift('agrupamento');
    }

    const summaryColumns = this.getSummaryColumns(
      this.columns,
      options.printColumns as string[],
    );

    const printPage = {
      all: (): void => {
        const groupsKeysMapped = Object.keys(groupedMappedData || {});
        this.exportAll.emit({
          options,
          columns: this.columns,
          summaryColumns,
          groupsKeysMapped,
        });
      },
      current: (): void => {
        const rows = this.translateRows();
        let data: IFileData[] = [];
        if (groupedMappedData) {
          const groupedColumns = [
            {
              prop: 'agrupamento',
              name: 'Agrupamento',
              label: 'agrupamento',
            },
            ...this._columns,
          ];

          Object.keys(groupedMappedData).forEach((key) => {
            const groupingLine = formatKeyValue(
              [this.setColumnsForByGroupedRowsExport(this.columns, key)],
              groupedColumns,
            );

            data.push(...(groupingLine as IFileData[]));
            const formatedRows = formatKeyValue(
              groupedMappedData[key],
              groupedColumns,
            );

            data.push(...(formatedRows as IFileData[]));
          });
        } else {
          const formatedRows = formatKeyValue(rows, this.columns);
          data = formatedRows as IData[];
        }

        const currencyColumns = this.applyCurrency(this.columns);

        const config = new ExportConfig({
          ...options,
          data: data ?? [],
          summaryColumns,
          summaryValues: this.getSummaryValues(summaryColumns),
          currencyColumns,
        });

        from(this.refExportFrom(config));
      },
    };

    printPage[type]();
  }

  setColumnsForByGroupedRowsExport(
    TableColumn:
      | TableColumn[]
      | { prop: string; name: string; label: string }[],
    keyGrouped: string,
  ): Record<string, unknown> {
    const columns: Record<string, unknown> = {
      agrupamento: keyGrouped,
    };

    TableColumn.forEach((column) => {
      if (!column.prop) return;

      columns[column.prop] = '';
    });
    return columns;
  }

  applyCurrency(mapColumns: TableColumn[]): ICurrency[] {
    const currencyData: ICurrency[] = [];
    for (const col of mapColumns) {
      if (col.currency) {
        const currency =
          typeof col.currency === 'function' ? col.currency() : col.currency;
        let column = '';

        if (col.label?.length) {
          column = col.label;
        } else if (col.prop?.toString().length) {
          column = String(col.prop);
        } else if (col.name?.length) {
          column = col.name;
        }

        if (currency && column.length) {
          currencyData.push({
            column,
            currency,
          });
        }
      }
    }

    return currencyData;
  }

  private getSummaryValues(summaryColumns: string[]): ISummary[] {
    const summaryValues: ISummary[] = [];

    summaryColumns.forEach((column) => {
      const tableColumn = this.columns.find((item) => item.label === column);

      if (tableColumn?.label && tableColumn?.summaryValue) {
        summaryValues.push({
          column: tableColumn.label,
          value: tableColumn.summaryValue,
        });
      }
    });
    return summaryValues;
  }

  private getSummaryColumns(
    columns: TableColumn[],
    printColumns?: string[],
  ): string[] {
    if (!printColumns) return [];
    const columnsEnable = columns.filter(
      (item) =>
        item.summaryCurrency === true &&
        item.label &&
        printColumns.includes(item.label),
    );

    const listColumns = columnsEnable.map((item) => item.label);

    return listColumns.length > 0 ? (listColumns as string[]) : [];
  }

  translateRows(): IFileData[] {
    const translatedIndexes = this._columns
      .filter((column: TableColumn) => {
        return column.translate;
      })
      .map((filteredColumn) => {
        return filteredColumn.prop as string;
      });

    const situationIndexes = this._columns
      .filter((column: TableColumn) => {
        return column.situation;
      })
      .map((filteredColumn) => {
        return filteredColumn.prop as string;
      });
    const rows = [...this.rows];
    return rows.map((row) => {
      const receivedRow = { ...row };
      for (const key of Object.keys(receivedRow)) {
        if (translatedIndexes.includes(key)) {
          const translated = this._translatorPipe?.transform(receivedRow[key]);
          receivedRow[key] = translated ?? receivedRow[key];
        }
        if (situationIndexes.includes(key)) {
          const translated = this._translatorPipe?.transform(
            receivedRow[key] ? 'COMMONS.ACTIVE' : 'COMMONS.INACTIVE',
          );
          receivedRow[key] = translated ?? receivedRow[key];
        }
      }
      return receivedRow;
    });
  }
}
