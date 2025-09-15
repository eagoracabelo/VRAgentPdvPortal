import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { exportFromBrowser } from '@vrsoftbr/vr-file-export';
import {
  ExportConfig,
  IOption,
} from '@vrsoftbr/vr-file-export/config/export-config';
import { formatKeyValue } from '@vrsoftbr/vr-file-export/format-key-value';
import { IData } from '@vrsoftbr/vr-file-export/shared/idata';
import { ExportType, TypesExport } from '@vrsoftbr/vr-file-export/shared/types';
import { from, Subscription, take } from 'rxjs';

import { TranslationService } from '../../../../services/translation.service';
import { IExportData } from '../../common/export-data';
import { Modal } from '../../modal/class/modal';
import { ExcelConfigComponent } from '../../modal/components/excel-config/excel-config.component';
import { PdfConfigComponent } from '../../modal/components/pdf-config/pdf-config.component';
import { TxtConfigComponent } from '../../modal/components/txt-config/txt-config.component';
import { ModalRef } from '../../modal/references/modal-ref';
import { TableColumn } from './../../../../types/table-column.type';
import { TableRow } from './../../../../types/table-row.type';

export interface IFileData {
  [key: string]: string | number | unknown;
}

let ID = 0;

@Component({
  selector: 'export-file',
  templateUrl: './export-file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportFileComponent implements OnInit, OnDestroy {
  private _isTablesToolsExportOpen = false;

  public radioRelatorioId = `radio-relatorio-${ID}`;
  public radioExcelId = `radio-excel-${ID}`;
  public radioArquivoId = `radio-arquivo-${ID}`;

  types = TypesExport;
  fileType!: ExportType;

  openModal = false;

  private _rows!: TableRow[];
  private _columns!: TableColumn[];

  get isTablesToolsExportOpen(): boolean {
    return this._isTablesToolsExportOpen;
  }

  @Input() set rows(val: TableRow[]) {
    this._rows = val;
  }

  get rows(): TableRow[] {
    return this._rows;
  }

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  refExportFrom = exportFromBrowser;

  private readonly _subs: Subscription[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly _translationService: TranslationService,
    private readonly _cd: ChangeDetectorRef,
  ) {
    ID++;
  }

  ngOnInit(): void {
    const sub = this._translationService.loadedTranslations$.subscribe(() =>
      this._cd.detectChanges(),
    );
    this._subs.push(sub);
  }

  toggleTablesToolsExport(): void {
    this._isTablesToolsExportOpen = !this._isTablesToolsExportOpen;
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
        this.generateFile(PdfConfigComponent, this.fileType);
        break;
      case 'xls':
        this.generateFile(ExcelConfigComponent, this.fileType, 'planilha');
        break;
      case 'txt':
        this.generateFile(TxtConfigComponent, this.fileType, 'arquivo');
        break;
      default:
        throw new Error(`Can't export unknown data type ${msg}.`);
    }
  }

  private generateFile(
    componentType: Type<unknown>,
    exportType: ExportType,
    name?: string,
  ): void {
    const fileName = `${name ?? exportType}-${new Date(Date.now()).getTime()}`;

    const componentmodal = this.modalInstance(componentType);

    componentmodal.afterOk.pipe(take(1)).subscribe((value: IExportData) => {
      const options = Object.assign(new ExportConfig(), {
        ...value,
        exportType,
        fileName,
      });
      this.printPageOptions(options);
    });
  }

  private modalInstance(componentType: Type<unknown>): ModalRef<IExportData> {
    const modal = new Modal<IExportData>(this.injector, this.viewContainerRef);
    return modal.open(componentType, {
      data: this.columns,
    });
  }

  private printPageOptions(options: IOption): void {
    const formatedRows = formatKeyValue(this.rows, this.columns);
    const data = formatedRows as IData[];
    const config = new ExportConfig({ ...options, data });
    from(this.refExportFrom(config));
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
