import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  input,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import posthog from 'posthog-js';
import { TableColumn } from '../../../../types/table-column.type';
import {
  getLocalStorage,
  setLocalStorage,
} from '../../../../utils/storage-helper';
import { IStorageColumn } from './../../../../interfaces/storage-column.interface';
import { EditColumnService } from './../../../../services/edit-column.service';

@Component({
  selector: 'move-column',
  templateUrl: './move-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveColumnComponent implements OnInit, OnDestroy {
  @Output() isMoveColumn = new EventEmitter<boolean>();
  @Output() isEditColumn = new EventEmitter<boolean>();
  @Output() reloadData = new EventEmitter<boolean>();
  @Output() tempEditColumn = new EventEmitter<IStorageColumn[]>();

  @HostBinding('class') hostClass = 'datatable-tools-move-column';

  edit = false;
  private _storageKey!: string | undefined;
  private _columns!: TableColumn[];

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() set storageKeyMoveColumn(val: string | undefined) {
    this._storageKey = val;
  }

  eventTrackingIdentifier = input<string>('');

  get storageKeyMoveColumn(): string | undefined {
    return this._storageKey;
  }

  private tempStorageColumns: IStorageColumn[] = [];
  private _storageColumns: IStorageColumn[] = [];

  get storageColumns(): IStorageColumn[] {
    return this._storageColumns;
  }

  private readonly _subs: Subscription[] = [];
  constructor(private readonly _editColumnService: EditColumnService) {}

  ngOnInit(): void {
    this.loadStorage();
  }

  private loadStorage(): void {
    this.tempStorageColumns = [];
    this._storageColumns = this.getStorageColumns();
  }

  private getStorageColumns(): IStorageColumn[] {
    if (this.storageKeyMoveColumn) {
      const storageOrderColumns = getLocalStorage<IStorageColumn[]>(
        this.storageKeyMoveColumn,
      );

      if (storageOrderColumns) {
        return storageOrderColumns;
      }
    }

    return [];
  }

  editColumn(): void {
    this.edit = !this.edit;
    this.isEditColumn.emit(this.edit);
    this.loadStorage();
    this.tempToggleColumn();
  }

  getColumnsPosition(): IStorageColumn[] {
    const tempStg: IStorageColumn[] = [];

    for (const column of this.columns) {
      const tempStorageColumn = this.tempStorageColumns.find(
        (temp: IStorageColumn) => temp.prop === column.prop,
      );

      if (tempStorageColumn) {
        column.visibleColumn = tempStorageColumn.active;
        tempStg.push(tempStorageColumn);
      } else {
        const storageColumn = this._storageColumns.find(
          (temp: IStorageColumn) => temp.prop === column.prop,
        );

        if (storageColumn) {
          column.visibleColumn = storageColumn.active;
          tempStg.push(storageColumn);
        } else {
          column.visibleColumn = true;
          tempStg.push({
            name: column.name as string,
            prop: column.prop as string,
            active: true,
          });
        }
      }
    }

    return tempStg;
  }

  saveStorage(): void {
    if (this.storageKeyMoveColumn) {
      const columnsPosition = this.getColumnsPosition();
      setLocalStorage(this.storageKeyMoveColumn, columnsPosition);
      this.editColumn();
      this.reloadData.emit(true);

      if (this.eventTrackingIdentifier()) {
        posthog.capture(
          this.eventTrackingIdentifier() + '_table_edit_clicked',
          {
            columns: columnsPosition,
          },
        );
      }
    }
  }

  eventToggleColumn(value: IStorageColumn): void {
    const index = this.tempStorageColumns.findIndex(
      (temp: IStorageColumn) => temp.name === value.name,
    );

    if (index > -1) {
      this.tempStorageColumns[index].active = value.active;
    } else {
      this.tempStorageColumns.push(value);
    }
  }

  resetToggleColumn(): void {
    this.loadStorage();
  }

  tempToggleColumn(): void {
    this._editColumnService.setTempEditColumn(this.tempStorageColumns);
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
