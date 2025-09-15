import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Modal } from '../../modal/class/modal';
import { ToggleColumnConfigComponent } from '../../modal/components/toggle-column-config/toggle-column-config.component';
import { ModalRef } from '../../modal/references/modal-ref';
import { IStorageColumn } from './../../../../interfaces/storage-column.interface';
import { TableColumn } from './../../../../types/table-column.type';
import { IToggleColumn } from './../../interfaces/toggle-column.interface';
import { ModalConfig } from './../../modal/config/modal-config';

@Component({
  selector: 'toggle-column',
  templateUrl: './toggle-column.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleColumnComponent implements OnDestroy {
  private _columns!: TableColumn[];
  private _storageColumns!: IStorageColumn[];

  @Output() eventToggleColumn = new EventEmitter<IStorageColumn>();

  @Output() resetToggleColumn = new EventEmitter<boolean>();

  @Output() tempToggleColumn = new EventEmitter<boolean>();

  @Input() set storageColumns(val: IStorageColumn[]) {
    this._storageColumns = val;
  }

  get storageColumns(): IStorageColumn[] {
    return this._storageColumns;
  }

  @Input() set columns(val: TableColumn[]) {
    this._columns = val;
  }

  get columns(): TableColumn[] {
    return this._columns;
  }

  private readonly _subs: Subscription[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  toggleColumn(): void {
    const componentmodal = this.modalInstance(ToggleColumnConfigComponent);

    this._subs.push(
      componentmodal.onEvent.subscribe((value: IStorageColumn) => {
        this.eventToggleColumn.emit(value);
      }),
    );

    this._subs.push(
      componentmodal.afterClosed.subscribe(() => {
        this.resetToggleColumn.emit(true);
      }),
    );

    this._subs.push(
      componentmodal.afterOk.subscribe(() => {
        this.tempToggleColumn.emit(true);
      }),
    );
  }

  private modalInstance(
    componentType: Type<unknown>,
  ): ModalRef<unknown, IStorageColumn> {
    const modal = new Modal<unknown, IStorageColumn>(
      this.injector,
      this.viewContainerRef,
    );
    const config: ModalConfig<IToggleColumn> = {
      data: {
        columns: this.columns,
        storage: this.storageColumns,
      },
    };

    return modal.open(componentType, config);
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
