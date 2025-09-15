/* eslint-disable */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  HostListener,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  Output,
} from '@angular/core';

@Component({
  selector: 'table-row-wrapper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './body-row-wrapper.component.html',
  host: {
    class: 'table-row-wrapper',
  },
})
export class TableRowWrapperComponent implements DoCheck {
  @Input() innerWidth!: number;
  @Input() rowDetail: any;
  @Input() groupHeader: any;
  @Input() offsetX!: number;
  @Input() detailRowHeight: any;
  @Input() row: any;
  @Input() groupedRows: any;
  @Output() rowContextmenu = new EventEmitter<{ event: MouseEvent; row: any }>(
    false,
  );

  @Input() set rowIndex(val: number) {
    this._rowIndex = val;
    this.rowContext.rowIndex = val;
    this.groupContext.rowIndex = val;
    this.cd.markForCheck();
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  @Input() set expanded(val: boolean) {
    this._expanded = val;
    this.groupContext.expanded = val;
    this.rowContext.expanded = val;
    this.cd.markForCheck();
  }

  get expanded(): boolean {
    return this._expanded;
  }

  groupContext: any;
  rowContext: any;

  private rowDiffer: KeyValueDiffer<{}, {}>;
  private _expanded = false;
  private _rowIndex!: number;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly differs: KeyValueDiffers,
  ) {
    this.groupContext = {
      group: this.row,
      expanded: this.expanded,
      rowIndex: this.rowIndex,
    };

    this.rowContext = {
      row: this.row,
      expanded: this.expanded,
      rowIndex: this.rowIndex,
    };

    this.rowDiffer = differs.find({}).create();
  }

  ngDoCheck(): void {
    if (this.rowDiffer.diff(this.row)) {
      this.rowContext.row = this.row;
      this.groupContext.group = this.row;
      this.cd.markForCheck();
    }
  }

  @HostListener('contextmenu', ['$event'])
  onContextmenu($event: MouseEvent): void {
    this.rowContextmenu.emit({ event: $event, row: this.row });
  }

  getGroupHeaderStyle(): any {
    const styles = {} as any;

    styles['transform'] = 'translate3d(' + this.offsetX + 'rem, 0rem, 0rem)';
    styles['backface-visibility'] = 'hidden';
    styles['width'] = this.innerWidth;

    return styles;
  }
}
