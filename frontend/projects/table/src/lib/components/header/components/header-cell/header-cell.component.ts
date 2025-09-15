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
import { TranslationService } from './../../../../services/translation.service';

/* eslint-disable */
@Component({
  selector: 'table-header-cell',
  templateUrl: './header-cell.component.html',
  host: {
    class: 'table-header-cell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderCellComponent implements OnDestroy {
  @Input() sortAscendingIcon!: string;
  @Input() sortDescendingIcon!: string;
  @Input() sortUnsetIcon!: string;

  @Input() isTarget!: boolean;
  @Input() targetMarkerTemplate: any;
  @Input() targetMarkerContext: any;

  _allRowsSelected!: boolean;

  @Input() set allRowsSelected(value) {
    this._allRowsSelected = value;
    this.cellContext.allRowsSelected = value;
  }
  get allRowsSelected() {
    return this._allRowsSelected;
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
    let cls = 'table-header-cell';

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
    return this.column.checkboxable &&
      this.column.headerCheckboxable &&
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
    private readonly _translationService: TranslationService,
    private readonly cd: ChangeDetectorRef,
  ) {
    this.cellContext = {
      column: this.column,
      sortDir: this.sortDir,
      sortFn: this.sortFn,
      allRowsSelected: this.allRowsSelected,
      selectFn: this.selectFn,
    };
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.columnContextmenu.emit({ event: $event, column: this.column });
  }

  ngOnInit() {
    const sub = this._translationService.loadedTranslations$.subscribe(() =>
      this.cd.detectChanges(),
    );
    this._subs.push(sub);
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

  private atualizarAlinhamentoTexto(): void {
    const texto = this.column?.dataType ?? 'texto';
    const tipoDadoColuna = TipoDadoColuna.pegarTipoDadoPeloTexto(texto);
    this._alinhamentoTexto = tipoDadoColuna.alinhamento;
  }

  ngOnDestroy(): void {
    if (this._sub) this._sub.unsubscribe();
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
