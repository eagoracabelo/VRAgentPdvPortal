/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

import { TableColumn } from '../../types/table-column.type';

@Component({
  selector: 'table-tools',
  templateUrl: './tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableToolsComponent {
  @HostBinding('class') hostClass = 'table-tools';

  private _rows!: unknown[];
  private _columns!: TableColumn[];
  private _translation!: string;

  @Input() set translation(lang: string) {
    this._translation = lang;
  }

  get translation(): string {
    return this._translation;
  }

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  @Input() set rows(val: any[]) {
    this._rows = val;
  }

  get rows(): any[] {
    return this._rows;
  }

  @Input() pageSizeOptions!: number[];

  @Output() pageSizeChange = new EventEmitter<number | string>();

  @Output() reloadData = new EventEmitter<boolean>();

  onPageSizeChange(pageSize: string | number): void {
    this.pageSizeChange.emit(pageSize);
  }
}
