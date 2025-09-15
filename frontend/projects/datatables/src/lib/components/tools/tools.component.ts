/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  input,
  Input,
  Output,
} from '@angular/core';
import { PrintPageType } from '@vrsoftbr/vr-file-export/shared/types';

import { SelectionType } from '../../types/selection.type';
import { TableColumn } from '../../types/table-column.type';
import { IExportAll } from './../../interfaces/export-all.interface';
import { IFireEventButton } from './interfaces/fire-event-button.interface';

@Component({
  selector: 'datatable-tools',
  templateUrl: './tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableToolsComponent {
  @HostBinding('class') hostClass = 'datatable-tools';

  private _rows!: unknown[];
  private _activeMoveColumn = false;
  private _storageKey!: string | undefined;
  private _columns!: TableColumn[];

  @Input() groupedRows!: any[];

  @Input() isEntradaProduto!: boolean;

  @Input() activeExportFile = true;

  @Input() selectedCount = 0;

  @Input() fireEventButtons: IFireEventButton[] = [];

  @Input() fixedFireEventButtons = false;

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() set activeMoveColumn(val: boolean) {
    this._activeMoveColumn = val;
  }

  get activeMoveColumn(): boolean {
    return this._activeMoveColumn;
  }

  @Input() set storageKeyMoveColumn(val: string | undefined) {
    this._storageKey = val;
  }

  get storageKeyMoveColumn(): string | undefined {
    return this._storageKey;
  }

  @Input() storageKeyColumnPrintingPreference: string | undefined;

  @Input() set rows(val: any[]) {
    this._rows = val;
  }

  get rows(): any[] {
    return this._rows;
  }

  @Input() storageKeyPageSize!: string;

  @Input() pageSizeOptions!: number[];

  @Input() selectedPageSize!: number;

  @Input() showMoveButton!: boolean;

  @Input() disableExportAll!: boolean;

  @Input() fileTitle!: string;

  @Input() onlyLandscapeView!: boolean;

  @Input() preSelectedColumns!: string[];

  @Input() selectedPrintPageType!: PrintPageType;

  @Output() isEditColumn = new EventEmitter<boolean>();

  @Output() pageSizeChange = new EventEmitter<number | string>();

  @Output() reloadData = new EventEmitter<boolean>();

  @Output() exportAll = new EventEmitter<IExportAll>();

  @Output() resetSelected = new EventEmitter();

  @Input() selectionType!: SelectionType;

  eventTrackingIdentifier = input<string>('');

  editColumn(move: boolean): void {
    this.isEditColumn.emit(move);
  }

  onPageSizeChange(pageSize: string | number): void {
    this.pageSizeChange.emit(pageSize);
  }

  onReloadData(reload: boolean): void {
    this.reloadData.emit(reload);
  }

  onExportAll(data: IExportAll): void {
    this.exportAll.emit(data);
  }

  onResetSelected(): void {
    this.resetSelected.emit();
  }
}
