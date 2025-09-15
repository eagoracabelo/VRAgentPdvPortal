import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  input,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TypesPrintPage } from '@vrsoftbr/vr-file-export/shared/types';

import { BehaviorSubject, Subscription } from 'rxjs';
import { ISortHeaderIcon } from '../interfaces/sortHeaderIcon.interface';
import { IStorageColumn } from '../interfaces/storage-column.interface';
import { ColumnChangesService } from '../services/column-changes.service';
import { DimensionsHelper } from '../services/dimensions-helper.service';
import { ScrollbarHelper } from '../services/scrollbar-helper.service';
import { TablePageScreen } from '../services/table-page-screen.service';
import { ColumnMode } from '../types/column-mode.type';
import { ContextmenuType } from '../types/contextmenu.type';
import { SelectionType } from '../types/selection.type';
import { TableColumn } from '../types/table-column.type';
import {
  getStorageMatchColumns,
  setColumnDefaults,
  translateTemplates,
} from '../utils/column-helper';
import { isArrayNumber } from '../utils/helpers';
import { adjustColumnWidths, forceFillColumnWidths } from '../utils/math';
import { sortRows } from '../utils/sort';
import { getLocalStorage, getPageSizeStorage } from '../utils/storage-helper';
import { throttleable } from '../utils/throttle';
import { groupRowsByParents, optionalGetterForProp } from '../utils/tree';
import { IVrcDatatableConfig } from '../vrc-datatables.module';
import { IExportAll } from './../interfaces/export-all.interface';
import { IFiltered } from './../interfaces/filtered.interface';
import { ISort } from './../interfaces/sort.interface';
import { DataTableBodyComponent } from './body/body.component';
import { DatatableGroupHeaderDirective } from './body/directives/body-group-header.directive';
import { DataTableColumnDirective } from './columns/column.directive';
import { DatatableFooterDirective } from './footer/directives/footer.directive';
import { DataTableHeaderComponent } from './header/header.component';
import { DatatableRowAddDirective } from './row-add/row-add.directive';
import { DatatableRowDetailDirective } from './row-detail/row-detail.directive';
import { IFireEventButton } from './tools/interfaces/fire-event-button.interface';

/* eslint-disable */
@Component({
  selector: 'vrc-datatable',
  templateUrl: './datatable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datatable.component.scss'],
  host: {
    class: 'vrc-datatable',
  },
  providers: [TablePageScreen],
})
export class DatatableComponent
  implements OnInit, DoCheck, AfterViewInit, AfterContentInit, OnDestroy
{
  /**
   * Set default row click selection
   */
  @Input() rowClickActiveSelected = true;

  /**
   * Show the edit button to move columns.
   */
  @Input() activeMoveColumn = false;

  /**
   * On edit column and save in local storage key.
   */
  @Input() storageKeyMoveColumn!: string;

  /**
   * Indexed DB key to store the column printing preference and check it automatically.
   */
  @Input() storageKeyColumnPrintingPreference!: string;

  /**
   * Definition of per page size options to display.
   */
  @Input()
  set pageSizeOptions(value: number[]) {
    if (isArrayNumber(value)) {
      this._pageSizeOptions = value;
    }
  }

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }

  /**
   * Definition key of storage key to page size.
   */
  @Input() storageKeyPageSize = 'datatable_page_size';

  /**
   * Definition selected to page size.
   */
  @Input() selectedPageSize!: number;

  /**
   * Show the striped rows.
   */
  @Input() striped = true;

  /**
   * set striped rows if true
   */
  @HostBinding('class.striped')
  get isStriped(): boolean {
    return this.striped;
  }

  /**
   * Template for the target marker of drag target columns.
   */
  @Input() targetMarkerTemplate: any;

  /**
   * Defines if the default event inside the cell will be called or not.
   */
  @Input() preventDefaultClickEnable: boolean = true;

  /**
   * Rows that are displayed in the table.
   */
  @Input() set rows(val: any) {
    this._rows = val;

    if (val) {
      this._internalRows = [...val];
    }

    // auto sort on new updates
    if (!this.externalSorting) {
      this.sortInternalRows();
    }

    // auto group by parent on new update
    this._internalRows = groupRowsByParents(
      this._internalRows,
      optionalGetterForProp(this.treeFromRelation),
      optionalGetterForProp(this.treeToRelation),
    );

    // recalculate sizes/etc
    this.recalculate();

    if (this._rows && this._groupRowsBy) {
      // If a column has been specified in _groupRowsBy created a new array with the data grouped by that row
      this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
    }

    this.cd.markForCheck();
  }

  /**
   * Gets the rows.
   */
  get rows(): any {
    return this._rows;
  }

  /**
   * This attribute allows the user to set the name of the column to group the data with
   */
  @Input() set groupRowsBy(val: string) {
    if (val) {
      this._groupRowsBy = val;
      if (this._rows && this._groupRowsBy) {
        // cretes a new array with the data grouped
        this.groupedRows = this.groupArrayBy(this._rows, this._groupRowsBy);
      }
    }
  }

  get groupRowsBy(): string {
    return this._groupRowsBy;
  }

  /**
   * This attribute allows the user to set a grouped array in the following format:
   *  [
   *    {groupid=1} [
   *      {id=1 name="test1"},
   *      {id=2 name="test2"},
   *      {id=3 name="test3"}
   *    ]},
   *    {groupid=2>[
   *      {id=4 name="test4"},
   *      {id=5 name="test5"},
   *      {id=6 name="test6"}
   *    ]}
   *  ]
   */
  @Input() groupedRows!: any[];

  /**
   * Columns to be displayed.
   */
  @Input() set columns(val: TableColumn[]) {
    if (val) {
      this._internalColumns = [...val];
      setColumnDefaults(this._internalColumns);
      this.recalculateColumns();
    }

    this._columns = val;
  }

  /**
   * Get the columns.
   */
  get columns(): TableColumn[] {
    return this._columns;
  }

  /**
   * List of row objects that should be
   * represented as selected in the grid.
   * Default value: `[]`
   */
  @Input() selected: any[] = [];

  /**
   * Enable vertical scrollbars
   */
  @Input() scrollbarV = false;

  /**
   * Enable horz scrollbars
   */
  @Input() scrollbarH = false;

  /**
   * The row height; which is necessary
   * to calculate the height for the lazy rendering.
   */
  @Input() rowHeight: number | 'auto' | ((row?: any) => number) = 30;

  /**
   * Type of column width distribution formula.
   * Example: flex, force, standard
   */
  @Input() columnMode: ColumnMode | keyof typeof ColumnMode =
    ColumnMode.standard;

  /**
   * The minimum header height in rem.
   * Pass a falsey for no header
   */
  @Input() headerHeight = 2.625;

  /**
   * The minimum footer height in rem.
   * Pass falsey for no footer
   */
  @Input() footerHeight = 2;

  /**
   * If the table should fire events for selected items
   * shows button actions.
   */
  @Input() fireEventButtons: IFireEventButton[] = [];

  /**
   * If the table should show fire events for selected items all the time
   * shows button actions.
   */
  @Input() fixedFireEventButtons = false;

  /**
   * Rows that have some type of error
   * is used to highlight this rows with a red background
   */
  @Input() errorRows: unknown[] = [];

  /**
   * If the table should use external paging
   * otherwise its assumed that all data is preloaded.
   */
  @Input() externalPaging = true;

  /**
   * If the table should use external sorting or
   * the built-in basic sorting.
   */
  @Input() externalSorting = true;

  /**
   * The page size to be shown.
   * Default value: `undefined`
   */
  set limit(val: number | undefined) {
    this._limit = val;

    // recalculate sizes/etc
    this.recalculate();
  }

  /**
   * Gets the limit.
   */
  get limit(): number | undefined {
    return this._limit;
  }

  /**
   * The total count of all rows.
   * Default value: `0`
   */
  @Input() set count(val: number) {
    this._count = val;

    // recalculate sizes/etc
    this.recalculate();
  }

  /**
   * Gets the count.
   */
  get count(): number {
    return this._count;
  }

  /**
   * The current offset ( page - 1 ) shown.
   * Default value: `0`
   */
  @Input() set offset(val: number) {
    this._offset = val;
  }

  get offset(): number {
    return Math.max(
      Math.min(this._offset, Math.ceil(this.rowCount / this.pageSize) - 1),
      0,
    );
  }

  @Input() set filter(val: IFiltered) {
    this._filter = val;
  }

  get filter(): IFiltered {
    return this._filter;
  }

  /**
   * Show the linear loading bar.
   * Default value: `false`
   */
  @Input() loadingIndicator = false;

  /**
   * Type of row selection. Options are:
   *
   *  - `single`
   *  - `multi`
   *  - `checkbox`
   *  - `multiClick`
   *  - `cell`
   *
   * For no selection pass a `falsey`.
   * Default value: `undefined`
   */
  @Input() selectionType!: SelectionType;

  /**
   * Enable/Disable ability to re-order columns
   * by dragging them.
   */
  @Input() reorderable = true;

  /**
   * Enable/Disable tools of the exporting file
   * Default value: `true`
   */
  @Input() activeExportFile = true;

  /**
   * Swap columns on re-order columns or
   * move them.
   */
  @Input() swapColumns = true;

  /**
   * Array of sorted columns by property and type.
   * Default value: `[]`
   */
  @Input() sorts: ISort = {};

  /**
   * Css class overrides
   */
  @Input() cssClasses: any = {
    sortAscending: 'datatable-icon-up',
    sortDescending: 'datatable-icon-down',
    sortUnset: 'datatable-icon-sort-unset',
    pagerLeftArrow: 'datatable-icon-left',
    pagerRightArrow: 'datatable-icon-right',
    pagerPrevious: 'datatable-icon-prev',
    pagerNext: 'datatable-icon-skip',
  };

  @Input() sortHeaderIcons: ISortHeaderIcon = {
    sortAscending: 'seta_cima',
    sortDescending: 'seta_baixo',
  };

  /**
   * Message overrides for localization
   *
   * emptyMessage     [default] = 'No data to display'
   * ofMessage     [default] = 'total'
   * itemsMessage  [default] = 'selected'
   */
  @Input() messages: any = {
    // Message to show when array is presented
    // but contains no values
    emptyMessage: 'MESSAGE.NO-DATA',

    // Footer of message
    ofMessage: 'MESSAGE.OF',

    // Footer items message
    itemsMessage: 'MESSAGE.ITEMS',

    // Footer items per page message
    itemsPerPageMessage: 'MESSAGE.ITEMS-PER-PAGE',
  };

  /**
   * Row specific classes.
   * Similar implementation to ngClass.
   *
   *  [rowClass]="'first second'"
   *  [rowClass]="{ 'first': true, 'second': true, 'third': false }"
   */
  @Input() rowClass: any;

  /**
   * A boolean/function you can use to check whether you want
   * to select a particular row based on a criteria. Example:
   *
   *    (selection) => {
   *      return selection !== 'Ethel Price';
   *    }
   */
  @Input() selectCheck: any;

  /**
   * A function you can use to check whether you want
   * to show the checkbox for a particular row based on a criteria. Example:
   *
   *    (row, column, value) => {
   *      return row.name !== 'Ethel Price';
   *    }
   */
  @Input() displayCheck!: (row: any, column?: any, value?: any) => boolean;

  /**
   * A boolean you can use to set the detault behaviour of rows and groups
   * whether they will start expanded or not. If ommited the default is NOT expanded.
   *
   */
  @Input() groupExpansionDefault = false;

  /**
   * Property to which you can use for custom tracking of rows.
   * Example: 'name'
   */
  @Input() trackByProp!: string;

  /**
   * Property to which you can use for determining select all
   * rows on current page or not.
   *
   * @memberOf DatatableComponent
   */
  @Input() selectAllRowsOnPage = false;

  /**
   * A flag for row virtualization on / off
   */
  @Input() virtualization = true;

  /**
   * Tree from relation
   */
  @Input() treeFromRelation!: string;

  /**
   * Tree to relation
   */
  @Input() treeToRelation!: string;

  /**
   * A flag for switching summary row on / off
   */
  @Input() summaryRow = false;

  /**
   * A height of summary row
   */
  @Input() summaryHeight = 30;
  /**
   * Summary with pre-fix currency
   */
  @Input() summaryCurrency = false;

  /**
   * A property holds a summary row position: top/bottom
   */
  @Input() summaryPosition = 'top';

  /**
   * Propriedade para definir se as linhas serão clicáveis ou não
   */
  @Input() clickableRows = false;

  /**
   * Show move button on select item.
   */
  @Input() showMoveButton = false;

  /**
   * Check if is true to select all items and disable button
   */
  @Input() checkAllItems = false;

  /**
   * Disable export all
   */
  @Input() disableExportAll = true;

  /**
   * Set tools visibility
   */
  @Input() showToolsBar = true;

  /**
   * Body was scrolled typically in a `scrollbarV:true` scenario.
   */
  @Output() scroll: EventEmitter<any> = new EventEmitter();

  /**
   * A cell or row was focused via keyboard or mouse click.
   */
  @Output() activate: EventEmitter<any> = new EventEmitter();

  /**
   * A cell or row was selected.
   */
  @Output() select: EventEmitter<any> = new EventEmitter();

  /**
   * Column sort was invoked.
   */
  @Output() sort: EventEmitter<any> = new EventEmitter();

  /**
   * The table was paged either triggered by the pager or the body scroll.
   */
  @Output() page: EventEmitter<any> = new EventEmitter();

  /**
   * Columns were re-ordered.
   */
  @Output() reorder: EventEmitter<any> = new EventEmitter();

  /**
   * Column was resized.
   */
  @Output() resize: EventEmitter<any> = new EventEmitter();

  /**
   * The context menu was invoked on the table.
   * type indicates whether the header or the body was clicked.
   * content contains either the column or the row that was clicked.
   */
  @Output() tableContextmenu = new EventEmitter<{
    event: MouseEvent;
    type: ContextmenuType;
    content: any;
  }>(false);

  /**
   * A row was expanded ot collapsed for tree
   */
  @Output() treeAction: EventEmitter<any> = new EventEmitter();

  /**
   * Option for export all file in external service
   */
  @Output() exportAll = new EventEmitter<IExportAll>();

  /**
   * Name of exported file
   */
  @Input() fileTitle = '';

  /**
   * If true, restricts PDF files to landscape view only.
   */
  @Input() onlyLandscapeView = false;

  /**
   * List of column names pre-selected to export files.
   */
  @Input() preSelectedColumns = [];

  /**
   * Determines the pre-selected print page type for the datatable (current page or all pages).
   */
  @Input() selectedPrintPageType = TypesPrintPage.current;

  /**
   * Apply css zindex on row over next row
   */
  @Input() zindexRowOverNextRow = false;

  /**
   * Define the event traking identifier
   */
  eventTrackingIdentifier = input<string>('');

  /**
   * CSS class applied if the header height if fixed height.
   */
  @HostBinding('class.fixed-header')
  get isFixedHeader(): boolean {
    const headerHeight: number | string = this.headerHeight;
    return typeof headerHeight === 'string'
      ? <string>headerHeight !== 'auto'
      : true;
  }

  /**
   * CSS class applied to the root element if
   * the row heights are fixed heights.
   */
  @HostBinding('class.fixed-row')
  get isFixedRow(): boolean {
    return this.rowHeight !== 'auto';
  }

  /**
   * CSS class applied to root element if
   * vertical scrolling is enabled.
   */
  @HostBinding('class.scroll-vertical')
  get isVertScroll(): boolean {
    return this.scrollbarV;
  }

  /**
   * CSS class applied to root element if
   * virtualization is enabled.
   */
  @HostBinding('class.virtualized')
  get isVirtualized(): boolean {
    return this.virtualization;
  }

  /**
   * CSS class applied to the root element
   * if the horziontal scrolling is enabled.
   */
  @HostBinding('class.scroll-horz')
  get isHorScroll(): boolean {
    return this.scrollbarH;
  }

  /**
   * CSS class applied to root element is selectable.
   */
  @HostBinding('class.selectable')
  get isSelectable(): boolean {
    return this.selectionType !== undefined;
  }

  /**
   * CSS class applied to root is checkbox selection.
   */
  @HostBinding('class.checkbox-selection')
  get isCheckboxSelection(): boolean {
    return this.selectionType === SelectionType.checkbox;
  }

  /**
   * CSS class applied to root if cell selection.
   */
  @HostBinding('class.cell-selection')
  get isCellSelection(): boolean {
    return this.selectionType === SelectionType.cell;
  }

  /**
   * CSS class applied to root if single select.
   */
  @HostBinding('class.single-selection')
  get isSingleSelection(): boolean {
    return this.selectionType === SelectionType.single;
  }

  /**
   * CSS class added to root element if mulit select
   */
  @HostBinding('class.multi-selection')
  get isMultiSelection(): boolean {
    return this.selectionType === SelectionType.multi;
  }

  /**
   * CSS class added to root element if mulit click select
   */
  @HostBinding('class.multi-click-selection')
  get isMultiClickSelection(): boolean {
    return this.selectionType === SelectionType.multiClick;
  }

  /**
   * Column templates gathered from `ContentChildren`
   * if described in your markup.
   */
  @ContentChildren(DataTableColumnDirective)
  set columnTemplates(val: QueryList<DataTableColumnDirective>) {
    this._columnTemplates = val;
    this.translateColumns(val);
  }

  /**
   * Returns the column templates.
   */
  get columnTemplates(): QueryList<DataTableColumnDirective> {
    return this._columnTemplates;
  }

  /**
   * Row Detail templates gathered from the ContentChild
   */
  @ContentChild(DatatableRowDetailDirective)
  rowDetail!: DatatableRowDetailDirective;

  /**
   * Row add templates gathered from the ContentChild
   */
  @ContentChild(DatatableRowAddDirective)
  rowAdd!: DatatableRowAddDirective;

  /**
   * Group Header templates gathered from the ContentChild
   */
  @ContentChild(DatatableGroupHeaderDirective)
  groupHeader!: DatatableGroupHeaderDirective;

  /**
   * Footer template gathered from the ContentChild
   */
  @ContentChild(DatatableFooterDirective)
  footer!: DatatableFooterDirective;

  /**
   * Reference to the body component for manually
   * invoking functions on the body.
   */
  @ViewChild(DataTableBodyComponent)
  bodyComponent!: DataTableBodyComponent;

  /**
   * Reference to the header component for manually
   * invoking functions on the header.
   *
   * @memberOf DatatableComponent
   */
  @ViewChild(DataTableHeaderComponent)
  headerComponent!: DataTableHeaderComponent;

  /**
   * Returns if all rows are selected.
   */
  get allRowsSelected(): boolean {
    let allRowsSelected =
      this.rows && this.selected && this.selected.length === this.rows.length;

    if (this.bodyComponent && this.selectAllRowsOnPage) {
      const indexes = this.bodyComponent.indexes;
      const rowsOnPage = indexes.last - indexes.first;
      allRowsSelected = this.selected.length === rowsOnPage;
    }

    return (
      this.selected && this.rows && this.rows.length !== 0 && allRowsSelected
    );
  }

  get partialRowsSelected(): boolean {
    let partialRowsSelected =
      this.rows &&
      this.selected &&
      this.selected.length > 0 &&
      this.selected.length < this.rows.length;

    if (this.bodyComponent && this.selectAllRowsOnPage) {
      const indexes = this.bodyComponent.indexes;
      const rowsOnPage = indexes.last - indexes.first;
      partialRowsSelected =
        this.selected.length > 0 && this.selected.length < rowsOnPage;
    }

    return (
      this.selected &&
      this.rows &&
      this.rows.length !== 0 &&
      partialRowsSelected
    );
  }

  set isEditColumn(val: boolean) {
    this.showHideStorageColumns(!val);
    this._editColumn = val;
  }

  get isEditColumn() {
    return this._editColumn;
  }

  element: HTMLElement;
  _innerWidth!: number;
  pageSize!: number;
  bodyHeight!: number;
  rowCount = 0;
  rowDiffer: KeyValueDiffer<{}, {}>;

  _offsetX = new BehaviorSubject(0);
  _limit: number | undefined;
  _count = 0;
  _offset = 0;
  _filter: IFiltered = {};
  _rows!: any[];
  _groupRowsBy!: string;
  _internalRows!: any[];
  _internalColumns!: TableColumn[];
  _columns!: TableColumn[];
  _columnTemplates!: QueryList<DataTableColumnDirective>;
  _subscriptions: Subscription[] = [];
  _editColumn = false;
  _pageSizeOptions: number[] = [10, 15, 25, 50, 100];

  private _tempInternalColumns!: TableColumn[];

  constructor(
    @SkipSelf() private readonly _tablePageScreen: TablePageScreen,
    @SkipSelf() private readonly scrollbarHelper: ScrollbarHelper,
    @SkipSelf() private readonly dimensionsHelper: DimensionsHelper,
    private readonly cd: ChangeDetectorRef,
    element: ElementRef,
    differs: KeyValueDiffers,
    private readonly columnChangesService: ColumnChangesService,
    @Optional()
    @Inject('configuration')
    private readonly configuration: IVrcDatatableConfig,
  ) {
    // get ref to elm for measuring
    this.element = element.nativeElement;
    this.rowDiffer = differs.find({}).create();

    // apply global settings from Module.forRoot
    if (this.configuration?.messages) {
      this.messages = { ...this.configuration.messages };
    }
  }

  editColumn(move: boolean): void {
    this.isEditColumn = move;
  }

  pageSizeLimit(pageSize: string | number): void {
    this.limit = Number(pageSize);
    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset,
      filter: this.filter,
      order: this.sorts,
    });

    this.selectedPageSize = this.limit;
  }

  /**
   * Lifecycle hook that is called after data-bound
   * properties of a directive are initialized.
   */
  ngOnInit(): void {
    this.limit = getPageSizeStorage(
      this.storageKeyPageSize,
      this.pageSizeOptions,
    );

    // need to call this immediatly to size
    // if the table is hidden the visibility
    // listener will invoke this itself upon show
    this.recalculate();
  }

  onReloadData(): void {
    this.isStorageOrderColumns();
  }

  /**
   * Lifecycle hook that is called after a component's
   * view has been fully initialized.
   */
  ngAfterViewInit(): void {
    if (!this.externalSorting) {
      this.sortInternalRows();
    }

    // this has to be done to prevent the change detection
    // tree from freaking out because we are readjusting
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }

    requestAnimationFrame(() => {
      this.recalculate();

      if (this.externalPaging) {
        this.page.emit({
          count: this.count,
          pageSize: this.pageSize,
          limit: this.limit,
          offset: 0,
          filter: this.filter,
          order: this.sorts,
        });
      }
    });
  }

  /**
   * Lifecycle hook that is called after a component's
   * content has been fully initialized.
   */
  ngAfterContentInit(): void {
    this.columnTemplates.changes.subscribe((v) => this.translateColumns(v));
    this.listenForColumnInputChanges();
    this._tempInternalColumns = this._internalColumns;
    this.isStorageOrderColumns();
    this.showHideStorageColumns(true);
  }

  private isStorageOrderColumns(): void {
    if (this.storageKeyMoveColumn) {
      const storageOrderColumns = getLocalStorage<IStorageColumn[]>(
        this.storageKeyMoveColumn,
      );

      if (storageOrderColumns) {
        const matchColumns: TableColumn[] = getStorageMatchColumns(
          storageOrderColumns,
          this._internalColumns,
        );

        if (matchColumns.length > 0) {
          this._internalColumns = matchColumns;
        }
      }
    }
  }

  private showHideStorageColumns(isHide: boolean): void {
    if (this.storageKeyMoveColumn) {
      if (isHide) {
        const visibleColumns = this._internalColumns.filter(
          (column: TableColumn) => column.visibleColumn !== false,
        );

        this._internalColumns = visibleColumns;
      } else {
        this._internalColumns = this.editReCalculateColumns();
        this.isStorageOrderColumns();
      }

      this.recalculate();
    }
  }

  editReCalculateColumns(): TableColumn[] {
    if (Object.keys(this._tempInternalColumns).length > 0) {
      let widthFixed = 0;
      let widthCount = 0;
      this._tempInternalColumns.forEach((column) => {
        if (column.widthFixed && column.width) {
          widthFixed += column.width;
          widthCount++;
        }
      });

      const screen = this._innerWidth - widthFixed;
      const colmunSize = this._tempInternalColumns.length - widthCount;

      const newWidth = screen / (colmunSize <= 0 ? 1 : colmunSize);

      for (const tempInternalColumn of this._tempInternalColumns) {
        if (!tempInternalColumn.widthFixed) {
          tempInternalColumn.$$oldWidth = newWidth;
          tempInternalColumn.width = newWidth;
        }
      }

      this._internalColumns = [...this._tempInternalColumns];
    }

    return this._internalColumns;
  }

  /**
   * This will be used when displaying or selecting rows.
   * when tracking/comparing them, we'll use the value of this fn,
   *
   * (`fn(x) === fn(y)` instead of `x === y`)
   */
  @Input() rowIdentity: (x: any) => any = (x: any) => {
    if (this._groupRowsBy) {
      // each group in groupedRows are stored as {key, value: [rows]},
      // where key is the groupRowsBy index
      return x.key;
    } else {
      return x;
    }
  };

  /**
   *  Manually trigger the force column recalculation.
   */

  @Input()
  set forceCalculateColumns(val: unknown) {
    if (val !== null && val !== undefined) {
      setTimeout(() => {
        const dimensions = this.dimensionsHelper.getDimensions(this.element);
        if (dimensions.width > 0) {
          this.recalculate();
          if (this.scrollbarH || this.scrollbarV) {
            this.onBodyScroll({ offsetY: 0, offsetX: 0 } as MouseEvent);
          }
        }
      }, 10);
    }
  }

  /**
   * Translates the templates to the column objects
   */
  translateColumns(val: any): void {
    if (val) {
      const arr = val.toArray();
      if (arr.length) {
        this.updateColumnObjects(arr);
        setColumnDefaults(this._internalColumns);
        this.recalculateColumns();
        this.sortInternalRows();
        this.cd.markForCheck();
      }
    }
  }

  updateColumnObjects(arr: any[]): void {
    if (!this._internalColumns) {
      this._internalColumns = translateTemplates(arr);
    } else {
      this.updateColumns(this._internalColumns, arr);
      this.updateColumns(this._tempInternalColumns, arr);

      this._internalColumns = [...this._tempInternalColumns];
    }
  }

  updateColumns(colArray: any[], arr: any[]): void {
    colArray.forEach((col) => {
      const finded = arr.find((el: any) => el.name === col.name);

      if (finded) {
        const aux = translateTemplates([finded]);
        col.label = aux[0].label;
        col.columnGroup = aux[0].columnGroup;
        col.summaryValue = aux[0].summaryValue;
      }
    });
  }

  /**
   * Creates a map with the data grouped by the user choice of grouping index
   *
   * @param originalArray the original array passed via parameter
   * @param groupByIndex  the index of the column to group the data by
   */
  groupArrayBy(
    originalArray: any,
    groupBy: any,
  ): {
    key: any;
    value: any;
  }[] {
    // create a map to hold groups with their corresponding results
    const map = new Map();
    let i = 0;

    originalArray.forEach((item: any) => {
      const key = item[groupBy];
      if (!map.has(key)) {
        map.set(key, [item]);
      } else {
        map.get(key).push(item);
      }
      i++;
    });

    const addGroup = (key: any, value: any) => {
      return { key, value };
    };

    // convert map back to a simple array of objects
    return Array.from(map, (x) => addGroup(x[0], x[1]));
  }

  /*
   * Lifecycle hook that is called when Angular dirty checks a directive.
   */
  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.rows)) {
      if (!this.externalSorting) {
        this.sortInternalRows();
      } else {
        this._internalRows = [...this.rows];
      }

      // auto group by parent on new update
      this._internalRows = groupRowsByParents(
        this._internalRows,
        optionalGetterForProp(this.treeFromRelation),
        optionalGetterForProp(this.treeToRelation),
      );

      this.recalculatePages();
      this.cd.markForCheck();
    }
  }

  /**
   * Recalc's the sizes of the grid.
   *
   * Updated automatically on changes to:
   *
   *  - Columns
   *  - Rows
   *  - Paging related
   *
   * Also can be manually invoked or upon window resize.
   */
  recalculate(): void {
    this.recalculateDims();
    this.recalculateColumns();
    this.cd.markForCheck();
  }

  /**
   * Window resize handler to update sizes.
   */
  @HostListener('window:resize')
  @throttleable(5)
  onWindowResize(): void {
    const dimensions = this.dimensionsHelper.getDimensions(this.element);
    if (dimensions.width > 0) {
      this.recalculate();
    }
  }

  /**
   * Recalulcates the column widths based on column width
   * distribution mode and scrollbar offsets.
   */
  recalculateColumns(
    columns: any[] = this._internalColumns,
    forceIdx = -1,
    allowBleed: boolean = this.scrollbarH,
  ): any[] | undefined {
    if (!columns) return undefined;

    let width = this._innerWidth;
    if (this.scrollbarV) {
      width = width - this.scrollbarHelper.width;
    }

    if (this.columnMode === ColumnMode.force) {
      forceFillColumnWidths(columns, width, forceIdx, allowBleed);
    } else if (this.columnMode === ColumnMode.flex) {
      adjustColumnWidths(columns, width);
    }

    return columns;
  }

  /**
   * Recalculates the dimensions of the table size.
   * Internally calls the page size and row count calcs too.
   *
   */
  recalculateDims(): void {
    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();
    const dimensions = this.dimensionsHelper.getDimensions(this.element);
    this._innerWidth = Number(dimensions.width / htmlFontSize);

    if (this.scrollbarV) {
      let pxHeight = this.dimensionsHelper.getHeight(dimensions)(
        this.headerHeight,
        this.footerHeight,
      );

      if (this.showToolsBar) {
        const toolsHeight = this.dimensionsHelper.getToolsHeight(this.element);

        pxHeight = pxHeight - toolsHeight / htmlFontSize;
      }

      this.bodyHeight = pxHeight;
    }

    this.recalculatePages();
  }

  /**
   * Recalculates the pages after a update.
   */
  recalculatePages(): void {
    this.pageSize = this.calcPageSize();
    this.rowCount = this.calcRowCount();
  }

  /**
   * Body triggered a page event.
   */
  onBodyPage({ offset }: any): void {
    // Avoid pagination caming from body events like scroll when the table
    // has no virtualization and the external paging is enable.
    // This means, let's the developer handle pagination by my him(her) self
    if (this.externalPaging && !this.virtualization) {
      return;
    }

    this.offset = offset;

    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset,
      filter: this.filter,
      order: this.sorts,
    });
  }

  /**
   * The body triggered a scroll event.
   */
  onBodyScroll(event: MouseEvent): void {
    this._offsetX.next(event.offsetX);
    this.scroll.emit(event);
    this.cd.detectChanges();
  }

  /**
   * The footer triggered a page event.
   */
  onFooterPage(event: any): void {
    this.offset = event.page - 1;
    this.bodyComponent.updateOffsetY(this.offset);
    this.filter = event.filter;

    this.page.emit({
      count: this.count,
      pageSize: this.pageSize,
      limit: this.limit,
      offset: this.offset,
      filter: this.filter,
      order: this.sorts,
    });

    if (this.selectAllRowsOnPage) {
      this.selected = [];
      this.select.emit({
        selected: this.selected,
      });
    }
  }

  /**
   * Recalculates the sizes of the page
   */
  calcPageSize(val: any[] = this.rows): number {
    const isValidRowHight = typeof this.rowHeight === 'number';
    const calcPageSizeFn = this._tablePageScreen.calcPageSize(val)(
      isValidRowHight && this.scrollbarV && this.virtualization,
    );

    // other empty :(
    return calcPageSizeFn(
      this.bodyHeight,
      this.rowHeight as number,
      this.limit,
    );
  }

  /**
   * Calculates the row count.
   */
  calcRowCount(val: any[] = this.rows): number {
    const calcRowCountFn = this._tablePageScreen.calcRowCount(val)(
      this.externalPaging,
      this.count,
    )(this.groupedRows);

    return calcRowCountFn(
      this.treeFromRelation != null && this.treeToRelation != null,
      this._internalRows?.length,
    );
  }

  /**
   * The header triggered a contextmenu event.
   */
  onColumnContextmenu({ event, column }: any): void {
    this.tableContextmenu.emit({
      event,
      type: ContextmenuType.header,
      content: column,
    });
  }

  /**
   * The body triggered a contextmenu event.
   */
  onRowContextmenu({ event, row }: any): void {
    this.tableContextmenu.emit({
      event,
      type: ContextmenuType.body,
      content: row,
    });
  }

  /**
   * The header triggered a column resize event.
   */
  onColumnResize({ column, newValue }: any): void {
    /* Safari/iOS 10.2 workaround */
    if (column === undefined) {
      return;
    }

    let idx!: number;
    const cols = this._internalColumns.map((c, i) => {
      c = { ...c };

      if (c.$$id === column.$$id) {
        idx = i;
        c.width = newValue;

        // set this so we can force the column
        // width distribution to be to this value
        c.$$oldWidth = newValue;
      }

      return c;
    });

    this.recalculateColumns(cols, idx);
    this._internalColumns = cols;

    this.resize.emit({
      column,
      newValue,
    });
  }

  /**
   * The header triggered a column re-order event.
   */
  onColumnReorder({ column, newValue, prevValue }: any): void {
    if (!this._internalColumns[newValue].draggable) return;

    const cols = this._internalColumns.map((c) => {
      return { ...c };
    });

    if (this.swapColumns) {
      const prevCol = cols[newValue];
      cols[newValue] = column;
      cols[prevValue] = prevCol;
    } else {
      if (newValue > prevValue) {
        const movedCol = cols[prevValue];
        for (let i = prevValue; i < newValue; i++) {
          cols[i] = cols[i + 1];
        }
        cols[newValue] = movedCol;
      } else {
        const movedCol = cols[prevValue];
        for (let i = prevValue; i > newValue; i--) {
          cols[i] = cols[i - 1];
        }
        cols[newValue] = movedCol;
      }
    }

    this._internalColumns = cols;

    this.reorder.emit({
      column,
      newValue,
      prevValue,
    });
  }

  /**
   * The header triggered a column sort event.
   */
  onColumnSort(event: any): void {
    // clean selected rows
    if (this.selectAllRowsOnPage) {
      this.selected = [];
      this.select.emit({
        selected: this.selected,
      });
    }

    this.sorts = event.sorts;

    // this could be optimized better since it will resort
    // the rows again on the 'push' detection...
    if (this.externalSorting === false) {
      // don't use normal setter so we don't resort
      this.sortInternalRows();
    }

    // auto group by parent on new update
    this._internalRows = groupRowsByParents(
      this._internalRows,
      optionalGetterForProp(this.treeFromRelation),
      optionalGetterForProp(this.treeToRelation),
    );

    // Always go to first page when sorting to see the newly sorted data
    this.offset = 0;
    this.bodyComponent.updateOffsetY(this.offset);
    this.sort.emit(event);

    if (this.externalSorting === true) {
      this.page.emit({
        count: this.count,
        pageSize: this.pageSize,
        limit: this.limit,
        offset: this.offset,
        filter: this.filter,
        order: this.sorts,
      });
    }
  }

  /**
   * Toggle all row selection
   */
  onHeaderSelect(partiallySelected: boolean): void {
    if (this.rows && this.rows.length === 0) {
      return;
    }

    if (partiallySelected) {
      this.selected = [];
      return;
    }

    if (this.bodyComponent && this.selectAllRowsOnPage) {
      // before we splice, chk if we currently have all selected
      const first = this.bodyComponent.indexes.first;
      const last = this.bodyComponent.indexes.last;
      const allSelected = this.selected.length === last - first;

      // remove all existing either way
      this.selected = [];

      // do the opposite here
      if (!allSelected) {
        this.selected.push(...this._internalRows.slice(first, last));
      }
    } else {
      // before we splice, chk if we currently have all selected
      const allSelected = this.selected.length === this.rows.length;
      // remove all existing either way
      this.selected = [];
      // do the opposite here
      if (!allSelected) {
        this.selected.push(...this.rows);
      }
    }

    this.select.emit({
      selected: this.selected,
    });
  }

  /**
   * A row was selected from body
   */
  onBodySelect(event: any): void {
    this.select.emit(event);
  }

  /**
   * A row was expanded or collapsed for tree
   */
  onTreeAction(event: any): void {
    const row = event.row;
    // TODO: For duplicated items this will not work
    const rowIndex = this._rows.findIndex(
      (r) => r[this.treeToRelation] === event.row[this.treeToRelation],
    );
    this.treeAction.emit({ row, rowIndex });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * listen for changes to input bindings of all DataTableColumnDirective and
   * trigger the columnTemplates.changes observable to emit
   */
  private listenForColumnInputChanges(): void {
    this._subscriptions.push(
      this.columnChangesService.columnInputChanges$.subscribe(() => {
        if (this.columnTemplates) {
          this.columnTemplates.notifyOnChanges();
        }
      }),
    );
  }

  private sortInternalRows(): void {
    this._internalRows = sortRows(
      this._internalRows,
      this._internalColumns,
      this.sorts,
    );
  }

  onExportAll(data: IExportAll): void {
    this.exportAll.emit(data);
  }

  onResetSelected(): void {
    this.selected = [];
  }
}
