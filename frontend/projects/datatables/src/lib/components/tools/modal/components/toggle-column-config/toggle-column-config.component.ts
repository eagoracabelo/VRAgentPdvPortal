import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalConfig } from '../../config/modal-config';
import { ModalRef } from '../../references/modal-ref';
import { IStorageColumn } from './../../../../../interfaces/storage-column.interface';
import { TableColumn } from './../../../../../types/table-column.type';
import { IToggleColumn } from './../../../interfaces/toggle-column.interface';

@Component({
  selector: 'vrc-toggle-column-config',
  templateUrl: './toggle-column-config.component.html',
})
export class ToggleColumnConfigComponent implements OnInit, OnDestroy {
  columns: IStorageColumn[] = [];
  tableColumns: TableColumn[] = [];

  @HostBinding('class') hostClass = 'datatable-toggle-column-config';

  private readonly _subs: Subscription[] = [];

  constructor(
    private readonly config: ModalConfig<IToggleColumn>,
    public modal: ModalRef<unknown, IStorageColumn>,
  ) {
    this.formatData(config);
  }

  ngOnInit(): void {
    this.handleMainCheckbox();
  }

  private formatData(value: { data?: IToggleColumn }): void {
    if (value.data) {
      this.tableColumns = value.data.columns;
      this.columns = value.data.columns
        ?.map((column: TableColumn) => this.formatDataToStorage(column))
        .filter((item) => item && Object.keys(item.name).length !== 0);
    } else {
      this.columns = [];
    }
  }

  private handleMainCheckbox(): void {
    const element = document.getElementById('mainCheckbox') as HTMLInputElement;
    element.checked = true;
    this.columns.forEach((column: IStorageColumn) => {
      if (!column.active) {
        element.checked = false;
      }
    });
  }

  private formatDataToStorage(column: TableColumn): IStorageColumn {
    if (this.config.data) {
      const containsInStorage = this.config.data.storage?.find(
        (value: IStorageColumn) => value.prop === column.prop,
      );

      if (containsInStorage) {
        return containsInStorage;
      } else {
        return {
          name: column.name,
          prop: column.prop,
          isDefaultVisible: column.isDefaultVisible,
          draggable: column.draggable,
          active: true,
        } as IStorageColumn;
      }
    }

    return {} as IStorageColumn;
  }

  isChecked(event: Event, value: IStorageColumn): void {
    const checkbox = event.target as HTMLInputElement;
    value.active = checkbox.checked;
    this.modal.onEventSend(value);
    this.handleMainCheckbox();
  }

  handleSelections(checked: boolean): void {
    this.columns.forEach((column: IStorageColumn) => {
      if (column.draggable) {
        column.active = checked;
        this.modal.onEventSend(column);
      }
    });
  }

  restoreDefault(): void {
    this.columns.forEach((column: IStorageColumn) => {
      column.active = column.isDefaultVisible as boolean;
      this.modal.onEventSend(column);
    });
    this.handleMainCheckbox();
  }

  apply(): void {
    this.modal.ok(true);
  }

  isHideColumn(value: IStorageColumn): boolean {
    const disabled = this.config.data?.columns?.find(
      (column: TableColumn) => value.prop === column.prop,
    );
    return disabled?.hideColumn ?? false;
  }

  getColumnNameTranslated(columnName: string): string {
    const name = this.tableColumns.find((column) => column.name === columnName);

    return name?.label ?? columnName;
  }

  trackByFn(index: number, item: IStorageColumn): string {
    return item.prop;
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
