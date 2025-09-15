import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { DimensionsHelper } from '../../services/dimensions-helper.service';

import { SelectionType } from '../../types/selection.type';
import { SortDirection } from '../../types/sort-direction.type';
import {
  columnGroupWidths,
  columnsByPin,
  columnsByPinArr,
} from '../../utils/column';
import { translateXY } from '../../utils/translate';
import { TableColumnDirective } from '../columns/column.directive';
import { ISort } from './../../interfaces/sort.interface';
import { TableColumn } from './../../types/table-column.type';

/* eslint-disable */
@Component({
  selector: 'table-header',
  templateUrl: './header.component.html',
  host: {
    class: 'table-header',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderComponent implements OnDestroy {
  @Input() sortAscendingIcon: any;
  @Input() sortDescendingIcon: any;
  @Input() sortUnsetIcon: any;
  @Input() scrollbarH!: boolean;
  @Input() dealsWithGroup!: boolean;
  @Input() targetMarkerTemplate: any;

  targetMarkerContext: any;

  @Input() set innerWidth(val: number) {
    this._innerWidth = val;
    setTimeout(() => {
      if (this._columns) {
        const colByPin = columnsByPin(this._columns);
        this._columnGroupWidths = columnGroupWidths(colByPin, this._columns);
        this.setStylesByGroup();
      }
    });
  }

  get innerWidth(): number {
    return this._innerWidth;
  }

  @Input() sorts!: ISort;
  @Input() allRowsSelected!: boolean;
  @Input() selectionType!: SelectionType;

  @HostBinding('style.height')
  @Input()
  set headerHeight(val: any) {
    if (val !== 'auto') {
      this._headerHeight = `${val}rem`;
    } else {
      this._headerHeight = val;
    }
  }

  get headerHeight(): any {
    return this._headerHeight;
  }

  @Input() set columns(val: any[]) {
    this._columns = val;

    const colsByPin = columnsByPin(val);
    this._columnsByPin = columnsByPinArr(val);
    setTimeout(() => {
      this._columnGroupWidths = columnGroupWidths(colsByPin, val);
      this.setStylesByGroup();
    });
  }

  get columns(): any[] {
    return this._columns;
  }

  @Input()
  set offsetX(val: number) {
    this._offsetX = val;
    this.setStylesByGroup();
  }
  get offsetX() {
    return this._offsetX;
  }

  @Output() sort: EventEmitter<any> = new EventEmitter();
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() resize: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() columnContextmenu = new EventEmitter<{
    event: MouseEvent;
    column: any;
  }>(false);

  _columnsByPin: any;
  _columnGroupWidths: any = {
    total: 6.25,
  };
  _innerWidth!: number;
  _offsetX!: number;
  _columns!: any[];
  _headerHeight!: string;
  _styleByGroup: { [prop: string]: {} } = {
    left: {},
    center: {},
    right: {},
  };

  private destroyed = false;

  constructor(
    private readonly dimensionsHelper: DimensionsHelper,
    private readonly cd: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  @HostBinding('style.width')
  get headerWidth(): string {
    if (this.scrollbarH) {
      return this.innerWidth + 'rem';
    }

    return '100%';
  }

  onColumnResized(width: number, column: TableColumnDirective): void {
    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();
    let remWidth = width / htmlFontSize;
    if (remWidth <= column.minWidth) {
      remWidth = column.minWidth;
    } else if (remWidth >= column.maxWidth) {
      remWidth = column.maxWidth;
    }

    this.resize.emit({
      column,
      prevValue: column.width,
      newValue: remWidth,
    });
  }

  onColumnReordered({ prevIndex, newIndex, model }: any): void {
    const column = this.getColumn(newIndex);
    column.isTarget = false;
    column.targetMarkerContext = undefined;
    this.reorder.emit({
      column: model,
      prevValue: prevIndex,
      newValue: newIndex,
    });
  }

  onTargetChanged({ prevIndex, newIndex, initialIndex }: any): void {
    if (prevIndex || prevIndex === 0) {
      const oldColumn = this.getColumn(prevIndex);
      oldColumn.isTarget = false;
      oldColumn.targetMarkerContext = undefined;
    }
    if (newIndex || newIndex === 0) {
      const newColumn = this.getColumn(newIndex);
      newColumn.isTarget = true;

      if (initialIndex !== newIndex) {
        newColumn.targetMarkerContext = {
          class: 'targetMarker '.concat(
            initialIndex > newIndex ? 'dragFromRight' : 'dragFromLeft',
          ),
        };
      }
    }
  }

  getColumn(index: number): any {
    const leftColumnCount = this._columnsByPin[0].columns.length;
    if (index < leftColumnCount) {
      return this._columnsByPin[0].columns[index];
    }

    const centerColumnCount = this._columnsByPin[1].columns.length;
    if (index < leftColumnCount + centerColumnCount) {
      return this._columnsByPin[1].columns[index - leftColumnCount];
    }

    return this._columnsByPin[2].columns[
      index - leftColumnCount - centerColumnCount
    ];
  }

  onSort({ column, prevValue, newValue }: any): void {
    const sorts = this.calcNewSorts(column, prevValue, newValue);
    this.sort.emit({
      sorts,
      column,
      prevValue,
      newValue,
    });
  }

  calcNewSorts(
    column: TableColumn,
    prevValue: SortDirection,
    newValue: SortDirection,
  ): ISort {
    if (!this.sorts) {
      this.sorts = {};
    }

    let sorts = Object.assign({}, this.sorts);

    if (newValue === undefined) {
      sorts = {};
    } else if (prevValue) {
      sorts.dir = newValue;
    } else {
      sorts = { column: column.prop, dir: newValue };
    }

    return sorts;
  }

  setStylesByGroup() {
    this._styleByGroup['left'] = this.calcStylesByGroup('left');
    this._styleByGroup['center'] = this.calcStylesByGroup('center');
    this._styleByGroup['right'] = this.calcStylesByGroup('right');
    if (!this.destroyed) {
      this.cd.detectChanges();
    }
  }

  calcStylesByGroup(group: string): any {
    const widths = this._columnGroupWidths;
    const offsetX = this.offsetX;

    const styles = {
      width: `${widths[group]}rem`,
    };

    if (group === 'center') {
      translateXY(styles, offsetX * -1, 0);
    } else if (group === 'right') {
      const totalDiff = widths.total - this.innerWidth;
      const offset = totalDiff * -1;
      translateXY(styles, offset, 0);
    }

    return styles;
  }
}
