import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ExportPrintData,
  IExportData,
} from '@vrsoftbr/vr-file-export/shared/export-data';
import {
  PrintPageType,
  PrintType,
  TypesPrint,
  TypesPrintPage,
} from '@vrsoftbr/vr-file-export/shared/types';
import posthog from 'posthog-js';
import { TableColumn } from '../../../../../types/table-column.type';
import { ModalConfig } from '../../config/modal-config';
import { IModalFileConfig } from '../../interfaces/modal-file-config.interface';
import { ModalRef } from '../../references/modal-ref';

/* eslint-disable */
@Component({
  selector: 'datatable-file-config',
  templateUrl: './file-config.component.html',
  host: {
    class: 'datatable-file-config',
  },
})
export class FileConfigComponent implements OnDestroy {
  heads: any[] = [];
  selectedColumn: string[] = [];

  exportType!: string;

  typesPrint = TypesPrint;
  selectedPrintType: PrintType = TypesPrint.portrait;

  typesPrintPage = TypesPrintPage;
  selectedPrintPageType: PrintPageType = TypesPrintPage.current;

  disableExportAll!: boolean;
  onlyLandscapeView!: boolean;
  preSelectedColumns: string[] = [];
  eventTrackingIdentifier: string = '';

  private readonly _subs: Subscription[] = [];
  constructor(
    private readonly config: ModalConfig<IModalFileConfig>,
    public modal: ModalRef<IExportData>,
  ) {
    this.formatData(config);
  }

  private formatData(value: ModalConfig<IModalFileConfig>): void {
    if (value.data) {
      this.disableExportAll = value.data?.disableExportAll;
      this.onlyLandscapeView = value.data?.onlyLandscapeView;
      this.preSelectedColumns = value.data?.preSelectedColumns ?? [];
      this.selectedPrintPageType =
        value.data?.printPageType ?? TypesPrintPage.current;
      this.exportType = value.data.exportType;
      this.eventTrackingIdentifier = value.data.eventTrackingIdentifier ?? '';
      this.setTypePrintByOnlyLandscapeView();
    }
    if (
      value.data?.columns &&
      Object.prototype.toString.call(value.data.columns) === '[object Array]' &&
      Object.keys(value.data.columns).length > 0
    ) {
      this.heads = value.data.columns
        .map((item: TableColumn) => item.label ?? item.name)
        .filter((item) => item && Object.keys(item).length !== 0);
      this.checkColumnPrintingPreference();
    } else {
      this.heads = [];
      this.selectedColumn = [];
    }
  }

  private checkColumnPrintingPreference(): void {
    const savedColumnPreferences =
      this.config.data?.columnPrintingPreference?.map(
        (preference) => preference.column,
      ) ?? [];
    const allColumnPreferences = Array.from(
      new Set([...savedColumnPreferences, ...this.preSelectedColumns]),
    );

    if (allColumnPreferences.length > 0) {
      this.selectedColumn = [];
      for (const columnHeader of this.heads) {
        for (const preferredColumn of allColumnPreferences) {
          if (preferredColumn === columnHeader) {
            this.selectedColumn.push(columnHeader);
          }
        }
      }
    }
  }

  private setTypePrintByOnlyLandscapeView(): void {
    if (this.onlyLandscapeView) {
      this.selectedPrintType = TypesPrint.landscape;
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
      this.heads.forEach((element: any) => {
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

  isCheckedPrinPageType(value: PrintPageType): boolean {
    return this.selectedPrintPageType === value;
  }

  setTypePrintPage(value: PrintPageType): void {
    this.selectedPrintPageType = value;
  }

  applyPrint(): void {
    if (this.selectedColumn.length <= 0) {
      return;
    }

    const props = {
      printType: this.selectedPrintType,
      printPageType: this.selectedPrintPageType,
      printColumns: this.selectedColumn,
    };

    const data = new ExportPrintData(props);

    if (
      this.eventTrackingIdentifier &&
      this.eventTrackingIdentifier.length > 0
    ) {
      posthog.capture(this.eventTrackingIdentifier + '_report_export_clicked', {
        props,
      });
    }

    this.modal.ok(data);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
