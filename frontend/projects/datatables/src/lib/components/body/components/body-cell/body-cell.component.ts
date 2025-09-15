import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FactoryOpts } from 'imask';
import { Subscription } from 'rxjs';

import { IFormatacaoDados } from '../../../../types/formatacao-dados.type';
import { SortDirection } from '../../../../types/sort-direction.type';
import { TableColumn } from '../../../../types/table-column.type';
import { TipoDadoColuna } from '../../../../types/tipo-dado-coluna.type';
import { Keys } from '../../../../utils/keys';
import { IStorageColumn } from './../../../../interfaces/storage-column.interface';
import { EditColumnService } from './../../../../services/edit-column.service';

/* eslint-disable */
export type TreeStatus = 'collapsed' | 'expanded' | 'loading' | 'disabled';

@Component({
  selector: 'datatable-body-cell',
  templateUrl: 'body-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableBodyCellComponent implements OnInit, DoCheck, OnDestroy {
  @Input() isEditColumn!: boolean;

  @Input() preventDefaultClickEnable!: boolean;

  @Input() displayCheck!: (
    row: any,
    column?: TableColumn,
    value?: any,
  ) => boolean;

  @Input() set group(group: any) {
    this._group = group;
    this.cellContext.group = group;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get group(): any {
    return this._group;
  }

  @Input() set rowHeight(val: number) {
    this._rowHeight = val;
    this.cellContext.rowHeight = val;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get rowHeight(): number {
    return this._rowHeight;
  }

  @Input() set isSelected(val: boolean) {
    this._isSelected = val;
    this.cellContext.isSelected = val;
    this.cd.markForCheck();
  }

  get isSelected(): boolean {
    return this._isSelected;
  }

  @Input() set expanded(val: boolean) {
    this._expanded = val;
    this.cellContext.expanded = val;
    this.cd.markForCheck();
  }

  get expanded(): boolean {
    return this._expanded;
  }

  @Input() set rowIndex(val: number) {
    this._rowIndex = val;
    this.cellContext.rowIndex = val;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  @Input() set column(column: TableColumn) {
    this._column = column;
    this.cellContext.column = column;
    this.atualizarConfigFormatacao();
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get column(): TableColumn {
    return this._column;
  }

  @Input() set row(row: any) {
    this._row = row;
    this.cellContext.row = row;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get row(): any {
    return this._row;
  }

  @Input() set sorts(val: any[]) {
    this._sorts = val;
    this.calcSortDir = this.calcSortDir(val);
  }

  get sorts(): any[] {
    return this._sorts;
  }

  @Input() set treeStatus(status: TreeStatus) {
    if (
      status !== 'collapsed' &&
      status !== 'expanded' &&
      status !== 'loading' &&
      status !== 'disabled'
    ) {
      this._treeStatus = 'collapsed';
    } else {
      this._treeStatus = status;
    }
    this.cellContext.treeStatus = this._treeStatus;
    this.checkValueUpdates();
    this.cd.markForCheck();
  }

  get treeStatus(): TreeStatus {
    return this._treeStatus;
  }

  @Output() activate: EventEmitter<any> = new EventEmitter();

  @Output() treeAction: EventEmitter<any> = new EventEmitter();

  @ViewChild('cellTemplate', { read: ViewContainerRef, static: true })
  cellTemplate!: ViewContainerRef;

  @HostBinding('class')
  get columnCssClasses(): string {
    let cls = 'datatable-body-cell';
    if (this.column.cellClass) {
      if (typeof this.column.cellClass === 'string') {
        cls += ' ' + this.column.cellClass;
      }
      cls += this.getFunctionCellClass();
    }
    cls += this.getCssProperties();

    return cls;
  }

  private getFunctionCellClass(): string {
    let cls = '';

    if (typeof this.column.cellClass === 'function') {
      const res = this.column.cellClass({
        row: this.row,
        group: this.group,
        column: this.column,
        value: this.value,
        rowHeight: this.rowHeight,
      });

      if (typeof res === 'string') {
        cls += ' ' + res;
      } else if (typeof res === 'object') {
        const keys = Object.keys(res);
        for (const k of keys) {
          if (res[k] === true) {
            cls += ` ${k}`;
          }
        }
      }
    }

    return cls;
  }

  private getCssProperties(): string {
    let cls = '';
    if (!this.sortDir) {
      cls += ' sort-active';
    }
    if (this.isFocused) {
      cls += ' active';
    }
    if (this.sortDir === SortDirection.asc) {
      cls += ' sort-asc';
    }
    if (this.sortDir === SortDirection.desc) {
      cls += ' sort-desc';
    }
    return cls;
  }

  @HostBinding('style.width.rem')
  get width(): number | undefined {
    return this.column.width;
  }

  @HostBinding('style.minWidth.rem')
  get minWidth(): number | undefined {
    return this.column.minWidth;
  }

  @HostBinding('style.maxWidth.rem')
  get maxWidth(): number | undefined {
    return this.column.maxWidth;
  }

  @HostBinding('style.height')
  get height(): string | number {
    const height = this.rowHeight;
    if (isNaN(height)) {
      return height;
    }
    return height + 'rem';
  }

  get textAlign(): string {
    return this._formatacaoDados.alinhamentoTexto;
  }

  get mascara(): FactoryOpts {
    return this._formatacaoDados.mascara;
  }

  sanitizedValue: any;
  value: any;
  valorSemFormatacao = '';
  sortDir!: SortDirection;
  isFocused = false;
  onCheckboxChangeFn = this.onCheckboxChange.bind(this);
  activateFn = this.activate.emit.bind(this.activate);

  cellContext: any;

  private _isSelected!: boolean;
  private _sorts!: any[];
  private _column!: TableColumn;
  private _row: any;
  private _group: any;
  private _rowHeight!: number;
  private _rowIndex!: number;
  private _expanded!: boolean;
  private _element: any;
  private _treeStatus!: TreeStatus;

  private _formatacaoDados: IFormatacaoDados = {
    mascara: TipoDadoColuna.texto.mascara,
    alinhamentoTexto: TipoDadoColuna.texto.alinhamento,
  };

  private tempEdit: boolean | undefined;

  private _sub!: Subscription;

  constructor(
    private readonly _editColumnService: EditColumnService,
    element: ElementRef,
    private readonly cd: ChangeDetectorRef,
    private readonly _renderer: Renderer2,
    @Inject(LOCALE_ID) public locale: string,
  ) {
    this.cellContext = {
      onCheckboxChangeFn: this.onCheckboxChangeFn,
      activateFn: this.activateFn,
      row: this.row,
      group: this.group,
      value: this.value,
      column: this.column,
      rowHeight: this.rowHeight,
      isSelected: this.isSelected,
      rowIndex: this.rowIndex,
      treeStatus: this.treeStatus,
      onTreeAction: this.onTreeAction.bind(this),
    };
    this._element = element.nativeElement;
  }

  ngOnInit(): void {
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

  ngDoCheck(): void {
    this.checkValueUpdates();
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }

    if (this._sub) this._sub.unsubscribe();
  }

  checkValueUpdates(): void {
    let value = '';

    if (this.column) {
      value = this.getColumnValue();
    }

    if (this.valorSemFormatacao !== value) {
      this.updateValue(value);
    }
  }

  private getColumnValue(): string {
    let columnValue = '';
    let value = '';

    if (this.column.$$valueGetter && this.column.prop) {
      columnValue = this.column.$$valueGetter(this.row, this.column.prop);
    }

    value = this.checkPipe(columnValue);

    return value;
  }

  private checkPipe(columnValue: string): string {
    const userPipe = this.column.pipe;
    let value = '';

    if (userPipe) {
      value = userPipe.transform(columnValue);
    } else if (value !== undefined) {
      value = columnValue;
    }

    return value;
  }

  private atualizarConfigFormatacao(): void {
    const texto = this.column?.dataType ?? 'texto';
    let mascara: string | FactoryOpts = { mask: '' };
    let tipoDadoColuna = TipoDadoColuna.texto;

    if (this.column.$$valueGetter && this.column.prop) {
      const valorCelula = this.column.$$valueGetter(this.row, this.column.prop);

      tipoDadoColuna = TipoDadoColuna.pegarTipoDadoPeloTexto(
        texto,
        valorCelula,
        this.locale,
      );

      mascara = this.column?.dataCustomMask ?? tipoDadoColuna.mascara;
    }

    if (typeof mascara === 'string') {
      this._formatacaoDados.mascara = { mask: mascara };
    } else {
      this._formatacaoDados.mascara = mascara;
      if (texto === 'id' && this.column?.padStart) {
        this.formatWithPadStart();
      }
    }

    this._formatacaoDados.alinhamentoTexto = tipoDadoColuna.alinhamento;
  }

  private formatWithPadStart(): void {
    this._formatacaoDados.mascara.mask = /^\w+$/;
    this._formatacaoDados.mascara.commit = (
      value: string,
      masked: any,
    ): void => {
      masked._value = String(value).padStart(this.column.padStart ?? 6, '0');
    };
  }

  private updateValue(value: string): void {
    const valorFormatado = TipoDadoColuna.aplicarMascara(
      value,
      this._formatacaoDados.mascara,
    );
    this.value = valorFormatado;
    this.valorSemFormatacao = value;

    this.cellContext.value = valorFormatado;
    this.sanitizedValue =
      valorFormatado !== null && valorFormatado !== undefined
        ? this.stripHtml(valorFormatado)
        : valorFormatado;

    this.cd.markForCheck();
  }

  @HostListener('focus')
  onFocus(): void {
    this.isFocused = true;
  }

  @HostListener('blur')
  onBlur(): void {
    this.isFocused = false;
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.preventDefaultClickEnable) {
      this.activate.emit({
        type: 'click',
        event,
        row: this.row,
        group: this.group,
        rowHeight: this.rowHeight,
        column: this.column,
        value: this.value,
        cellElement: this._element,
      });
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('dblclick', ['$event'])
  onDblClick(event: MouseEvent): void {
    this.activate.emit({
      type: 'dblclick',
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element,
    });
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetCell = event.target === this._element;

    const isAction =
      keyCode === Keys.return ||
      keyCode === Keys.down ||
      keyCode === Keys.up ||
      keyCode === Keys.left ||
      keyCode === Keys.right;

    if (isAction && isTargetCell) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        group: this.group,
        rowHeight: this.rowHeight,
        column: this.column,
        value: this.value,
        cellElement: this._element,
      });
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onCheckboxChange(event: any): void {
    this.activate.emit({
      type: 'checkbox',
      event,
      row: this.row,
      group: this.group,
      rowHeight: this.rowHeight,
      column: this.column,
      value: this.value,
      cellElement: this._element,
      treeStatus: 'collapsed',
    });
    event.preventDefault();
    event.stopPropagation();
  }

  calcSortDir(sorts: any[]): any {
    if (!sorts) {
      return;
    }

    const sort = sorts.find((s: any) => {
      return s.prop === this.column.prop;
    });

    if (sort) {
      return sort.dir;
    }
  }

  stripHtml(html: string): string {
    if (!html?.replace) {
      return html;
    }
    return html?.replace(/<\/?[\w\s="'./:;#?-]+>/gi, '');
  }

  onTreeAction(): void {
    this.treeAction.emit(this.row);
  }

  calcLeftMargin(column: any, row: any): any {
    const levelIndent = column.treeLevelIndent ?? 50;
    return column.isTreeColumn ? row.level * levelIndent : 0;
  }

  isHidden(): boolean {
    if (this.isEditColumn && typeof this.tempEdit === 'boolean') {
      return this.tempEdit;
    }

    return !this.column.visibleColumn && this.isEditColumn;
  }
}
