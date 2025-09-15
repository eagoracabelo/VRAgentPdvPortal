/* eslint-disable */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
  SkipSelf,
} from '@angular/core';

import { ScrollbarHelper } from '../../../../services/scrollbar-helper.service';
import {
  columnGroupWidths,
  columnsByPin,
  columnsByPinArr,
} from '../../../../utils/column';
import { Keys } from '../../../../utils/keys';
import { translateXY } from '../../../../utils/translate';
import { TreeStatus } from '../body-cell/body-cell.component';

@Component({
  selector: 'datatable-body-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './body-row.component.html',
})
export class DataTableBodyRowComponent implements DoCheck {
  @Input() set columns(val: any[]) {
    this._columns = val;
    this.recalculateColumns(val);
    this.buildStylesByGroup();
  }

  _rowAdd: any;
  @Input() set rowAdd(value: any) {
    this._rowAdd = value;

    if (value) {
      this._element.setAttribute('style', 'flex-direction: column;');
    } else {
      this._element.removeAttribute('style', 'flex-direction: column;');
    }
  }
  get rowAdd(): any {
    return this._rowAdd;
  }

  get columns(): any[] {
    return this._columns;
  }

  @Input() set selectedRowClicked(value: any) {
    if (value === this.row) {
      this._element.classList.add('active-row');
    } else {
      this._element.classList.remove('active-row');
    }
  }

  @Input() set innerWidth(val: number) {
    if (this._columns) {
      const colByPin = columnsByPin(this._columns);
      this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
    }

    this._innerWidth = val;
    this.recalculateColumns();
    this.buildStylesByGroup();
  }

  get innerWidth(): number {
    return this._innerWidth;
  }

  @Input() isEditColumn!: boolean;
  @Input() preventDefaultClickEnable!: boolean;

  @Input() expanded!: boolean;
  @Input() rowClass: any;
  @Input() row: any;
  @Input() group: any;
  @Input() isSelected!: boolean;
  @Input() rowIndex!: number;
  @Input() displayCheck: any;
  @Input() treeStatus: TreeStatus = 'collapsed';

  @Input()
  set offsetX(val: number) {
    this._offsetX = val;
    this.buildStylesByGroup();
  }
  get offsetX(): number {
    return this._offsetX;
  }

  @Input() clickableRows!: boolean;

  @HostBinding('class')
  get cssClass(): string {
    let cls = 'datatable-body-row';

    if (this.isSelected) {
      cls += ' active';
    }

    cls += this.handleEvenOdd();

    if (this.rowClass) {
      const res = this.rowClass(this.row);
      if (typeof res === 'string') {
        cls += ` ${res}`;
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

  private handleEvenOdd(): string {
    const index = Number(String(this.rowIndex).split('-').pop());

    if (index % 2 !== 0) {
      return ' datatable-row-odd';
    }

    return ' datatable-row-even';
  }

  @HostBinding('style.height.rem')
  @Input()
  rowHeight!: number;

  @HostBinding('style.width.rem')
  get columnsTotalWidths(): string {
    return this._columnGroupWidths.total;
  }

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() treeAction: EventEmitter<any> = new EventEmitter();

  _element: any;
  _columnGroupWidths: any;
  _columnsByPin: any;
  _offsetX!: number;
  _columns!: any[];
  _innerWidth!: number;
  _groupStyles: { [prop: string]: {} } = {
    left: {},
    center: {},
    right: {},
  };

  private _rowDiffer: KeyValueDiffer<{}, {}>;

  constructor(
    private readonly differs: KeyValueDiffers,
    @SkipSelf() private readonly scrollbarHelper: ScrollbarHelper,
    private readonly cd: ChangeDetectorRef,
    element: ElementRef,
  ) {
    this._element = element.nativeElement;
    this._rowDiffer = differs.find({}).create();
  }

  ngDoCheck(): void {
    if (this._rowDiffer.diff(this.row)) {
      this.cd.markForCheck();
    }
  }

  isGroupEdgeIndex(index: number): boolean {
    return (
      this.columns[index + 1] &&
      this.columns[index + 1].columnGroup !== this.columns[index].columnGroup
    );
  }

  buildStylesByGroup() {
    this._groupStyles['left'] = this.calcStylesByGroup('left');
    this._groupStyles['center'] = this.calcStylesByGroup('center');
    this._groupStyles['right'] = this.calcStylesByGroup('right');
    this.cd.markForCheck();
  }

  calcStylesByGroup(group: string): {
    width: string;
  } {
    const widths = this._columnGroupWidths;
    const offsetX = this.offsetX;

    const styles = {
      width: `${widths[group]}rem`,
    };

    if (group === 'left') {
      translateXY(styles, offsetX, 0);
    } else if (group === 'right') {
      const bodyWidth = parseInt(this.innerWidth + '', 0);
      const totalDiff = widths.total - bodyWidth;
      const offsetDiff = totalDiff - offsetX;
      const offset = (offsetDiff + this.scrollbarHelper.width) * -1;
      translateXY(styles, offset, 0);
    }

    return styles;
  }

  onActivate(event: any, index: number): void {
    event.cellIndex = index;
    event.rowElement = this._element;
    this.activate.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isTargetRow = event.target === this._element;

    const isAction =
      keyCode === Keys.return ||
      keyCode === Keys.down ||
      keyCode === Keys.up ||
      keyCode === Keys.left ||
      keyCode === Keys.right;

    if (isAction && isTargetRow) {
      event.preventDefault();
      event.stopPropagation();

      this.activate.emit({
        type: 'keydown',
        event,
        row: this.row,
        rowElement: this._element,
      });
    }
  }

  @HostListener('mouseenter', ['$event'])
  onMouseenter(event: any): void {
    this.activate.emit({
      type: 'mouseenter',
      event,
      row: this.row,
      rowElement: this._element,
    });
  }

  recalculateColumns(val: any[] = this.columns): void {
    this._columns = val;
    const colsByPin = columnsByPin(this._columns);
    this._columnsByPin = columnsByPinArr(this._columns);
    this._columnGroupWidths = columnGroupWidths(colsByPin, this._columns);
  }

  onTreeAction(): void {
    this.treeAction.emit();
  }
}
