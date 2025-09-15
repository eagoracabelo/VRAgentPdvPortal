import {
  ChangeDetectorRef,
  Directive,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslationService } from '../../../../../services/translation.service';
import { ExportPrintData, IExportData } from '../../../common/export-data';
import { PrintType, TypesPrint } from '../../../common/types';
import { ModalConfig } from '../../config/modal-config';
import { ModalRef } from '../../references/modal-ref';
import { TableColumn } from './../../../../../types/table-column.type';

@Directive()
export abstract class BaseConfigComponent implements OnInit, OnDestroy {
  heads: string[] = [];
  selectedColumn: string[] = [];

  typesPrint = TypesPrint;
  selectedPrintType: PrintType = TypesPrint.portrait;

  protected _subs: Subscription[] = [];

  protected readonly _translationService!: TranslationService;
  protected readonly _cd!: ChangeDetectorRef;

  constructor(
    protected config: ModalConfig<TableColumn[]>,
    public modal: ModalRef<IExportData>,
    protected readonly injector: Injector,
  ) {
    this._translationService = this.injector.get(TranslationService);
    this._cd = this.injector.get(ChangeDetectorRef);
  }

  ngOnInit(): void {
    const sub = this._translationService.loadedTranslations$.subscribe(() =>
      this._cd.detectChanges(),
    );
    this._subs.push(sub);
  }

  formatData(value: ModalConfig<TableColumn[]>): void {
    if (
      value.data &&
      Object.prototype.toString.call(value.data) === '[object Array]' &&
      Object.keys(value.data).length > 0
    ) {
      if (value.data.length) {
        this.heads = value.data
          .filter((item: TableColumn) => item.exportable === true)
          .map((item: TableColumn) => item.label ?? item.name)
          .filter((item) => item && Object.keys(item).length !== 0) as string[];
      }
    } else {
      this.heads = [];
      this.selectedColumn = [];
    }
  }

  isChecked(event: Event, value: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedColumn.push(value);
    } else {
      this.selectedColumn.splice(this.selectedColumn.indexOf(value), 1);
    }
  }

  checkedAll(event: Event): void {
    this.selectedColumn = [];
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.heads.forEach((element: string) => {
        this.selectedColumn.push(element);
      });
    }
  }

  isCheckBoxChecked(value: string): boolean {
    return this.selectedColumn.includes(value);
  }

  isAllCheckBoxChecked(): boolean {
    return this.selectedColumn.length === this.heads.length;
  }

  isCheckedPrinType(value: PrintType): boolean {
    return this.selectedPrintType === value;
  }

  setTypePrint(value: PrintType): void {
    this.selectedPrintType = value;
  }

  applyPrint(): void {
    if (this.selectedColumn.length <= 0) {
      return;
    }

    const data = new ExportPrintData({
      printType: this.selectedPrintType,
      printColumns: this.selectedColumn,
    });

    this.modal.ok(data);
  }

  trackByFn(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
