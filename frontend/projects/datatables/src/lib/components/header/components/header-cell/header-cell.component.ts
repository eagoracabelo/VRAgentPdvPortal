import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { SelectionType } from '../../../../types/selection.type';
import { SortDirection } from '../../../../types/sort-direction.type';
import { TableColumn } from '../../../../types/table-column.type';
import { TipoDadoColuna } from '../../../../types/tipo-dado-coluna.type';
import { nextSortDir } from '../../../../utils/sort';
import { ISort } from './../../../../interfaces/sort.interface';
import { IStorageColumn } from './../../../../interfaces/storage-column.interface';
import { EditColumnService } from './../../../../services/edit-column.service';

/* eslint-disable */
@Component({
  selector: 'datatable-header-cell',
  templateUrl: './header-cell.component.html',
  host: {
    class: 'datatable-header-cell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableHeaderCellComponent implements OnDestroy {
  @Input() sortAscendingIcon!: string;
  @Input() sortDescendingIcon!: string;
  @Input() sortUnsetIcon!: string;
  @Input() checkAllItems = false;

  @Input() isTarget!: boolean;
  @Input() targetMarkerTemplate: any;
  @Input() targetMarkerContext: any;
  @Input() isEditColumn!: boolean;
  _allRowsSelected!: boolean;

  @Input() set allRowsSelected(value) {
    this._allRowsSelected = value;
    this.cellContext.allRowsSelected = value;
  }
  get allRowsSelected() {
    return this._allRowsSelected;
  }

  _partialRowsSelected!: boolean;

  @Input() set partialRowsSelected(value) {
    this._partialRowsSelected = value;
    this.cellContext.partialRowsSelected = value;
  }
  get partialRowsSelected() {
    return this._partialRowsSelected;
  }

  @Input() selectionType!: SelectionType;

  @Input() set column(column: TableColumn) {
    this._column = column;
    this.cellContext.column = column;

    this.atualizarAlinhamentoTexto();

    this.cd.markForCheck();
  }

  get column(): TableColumn {
    return this._column;
  }

  @HostBinding('style.height.rem')
  @Input()
  headerHeight!: number;

  @Input() set sorts(val: ISort) {
    this._sorts = val;
    this.sortDir = this.calcSortDir(val);
    this.cellContext.sortDir = this.sortDir;
    this.calcSortClass(this.sortDir);
    this.cd.markForCheck();
  }

  get sorts(): ISort {
    return this._sorts;
  }

  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() columnContextmenu = new EventEmitter<{
    event: MouseEvent;
    column: any;
  }>(false);

  @HostBinding('class')
  get columnCssClasses(): any {
    let cls = 'datatable-header-cell';

    if (this.column.sortable) cls += ' sortable';
    if (this.column.resizeable) cls += ' resizeable';
    if (this.column.headerClass) {
      if (typeof this.column.headerClass === 'string') {
        cls += ' ' + this.column.headerClass;
      } else if (typeof this.column.headerClass === 'function') {
        const res = this.column.headerClass({
          column: this.column,
        });

        if (typeof res === 'string') {
          cls += res;
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          for (const k of keys) {
            if (res[k] === true) cls += ` ${k}`;
          }
        }
      }
    }

    const sortDir = this.sortDir;
    if (sortDir) {
      cls += ` sort-active sort-${sortDir}`;
    }

    return cls;
  }

  @HostBinding('attr.title')
  get name(): string | undefined {
    // guaranteed to have a value by setColumnDefaults() in column-helper.ts
    const label =
      this.column.label && this.column.label?.length > 0
        ? this.column.label
        : this.column.name;
    return this.column.headerTemplate === undefined ? label : undefined;
  }

  @HostBinding('style.minWidth.rem')
  get minWidth(): number | undefined {
    return this.column.minWidth;
  }

  @HostBinding('style.maxWidth.rem')
  get maxWidth(): number | undefined {
    return this.column.maxWidth;
  }

  @HostBinding('style.width.rem')
  get width(): number | undefined {
    return this.column.width;
  }

  get isCheckboxable(): boolean {
    return this.column?.checkboxable &&
      this.column?.headerCheckboxable &&
      this.selectionType === SelectionType.checkbox
      ? true
      : false;
  }

  get textAlign(): string {
    return this._alinhamentoTexto;
  }

  sortFn = this.onSort.bind(this);
  sortClass!: string;
  sortDir!: SortDirection | undefined;
  selectFn = this.select.emit.bind(this.select);

  cellContext: any;

  private _column!: TableColumn;
  private _sorts!: ISort;
  private _alinhamentoTexto!: string;

  private tempEdit: boolean | undefined;

  private _sub!: Subscription;
  private readonly _subs: Subscription[] = [];

  constructor(
    private readonly _editColumnService: EditColumnService,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.cellContext = {
      column: this.column,
      sortDir: this.sortDir,
      sortFn: this.sortFn,
      allRowsSelected: this.allRowsSelected,
      partialRowsSelected: this.partialRowsSelected,
      selectFn: this.selectFn,
    };
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.columnContextmenu.emit({ event: $event, column: this.column });
  }

  ngOnInit() {
    this.calcSortClass(this.sortDir);

    this._sub = this._editColumnService.tempEditColumn$.subscribe(
      (temp: IStorageColumn[]) => {
        const contains = temp.find(
          (tp: IStorageColumn) =>
            tp.name === this.column.name && tp.prop === this.column.prop,
        );

        if (contains) {
          this.tempEdit = !contains.active;
        } else {
          this.tempEdit = undefined;
        }

        this.cd.markForCheck();
      },
    );
  }

  calcSortDir(sorts: ISort): SortDirection | undefined {
    if (sorts && this.column) {
      if (sorts.column === this.column.prop) return sorts.dir;
    }

    return undefined;
  }

  onSort(event: PointerEvent): void {
    if (!this.column.sortable) return;

    const newValue = this.sortDir
      ? nextSortDir(this.sortDir)
      : this.getOnSortClicked(event);

    this.sort.emit({
      column: this.column,
      prevValue: this.sortDir,
      newValue,
    });
  }

  getOnSortClicked(clicked: PointerEvent): string {
    const y =
      clicked.clientY -
      (clicked.target as HTMLElement).getBoundingClientRect().top;

    const height = (clicked.target as HTMLElement).offsetHeight;

    const half = height / 2;

    if (y < half) {
      return SortDirection.asc;
    } else {
      return SortDirection.desc;
    }
  }

  calcSortClass(sortDir: SortDirection | undefined): void {
    if (!this.cellContext.column.sortable) {
      this.sortClass = '';
    } else if (sortDir === SortDirection.asc) {
      this.sortClass = this.sortAscendingIcon;
    } else if (sortDir === SortDirection.desc) {
      this.sortClass = this.sortDescendingIcon;
    } else {
      this.sortClass = this.sortUnsetIcon;
    }
  }

  private atualizarAlinhamentoTexto(): void {
    const texto = this.column?.dataType ?? 'texto';
    const tipoDadoColuna = TipoDadoColuna.pegarTipoDadoPeloTexto(texto);
    this._alinhamentoTexto = tipoDadoColuna.alinhamento;
  }

  isHidden(): boolean {
    if (this.isEditColumn && typeof this.tempEdit === 'boolean') {
      return this.tempEdit;
    }

    return !this.column.visibleColumn && this.isEditColumn;
  }

  ngOnDestroy(): void {
    if (this._sub) this._sub.unsubscribe();
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
