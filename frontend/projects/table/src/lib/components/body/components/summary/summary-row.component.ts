/* eslint-disable */
import {
  Component,
  Input,
  OnChanges,
  PipeTransform,
  TemplateRef,
} from '@angular/core';

export interface ISummaryColumn {
  summaryFunc?: (cells: any[]) => any;
  summaryTemplate?: TemplateRef<any>;

  prop: string;
  pipe?: PipeTransform;
}

function defaultSumFunc(cells: number[]): number | null {
  const cellsWithValues = cells.filter((cell) => !!cell);

  if (!cellsWithValues.length) {
    return null;
  }
  if (cellsWithValues.some((cell) => typeof cell !== 'number')) {
    return null;
  }

  return cellsWithValues.reduce((res, cell) => res + cell, 0);
}

const noopSumFunc = () => {
  return null;
};

@Component({
  selector: 'table-summary-row',
  templateUrl: './summary-row.component.html',
  host: {
    class: 'table-summary-row',
  },
})
export class TableSummaryRowComponent implements OnChanges {
  @Input() rows!: any[];
  @Input() columns!: ISummaryColumn[];

  @Input() rowHeight!: number;
  @Input() offsetX!: number;
  @Input() innerWidth!: number;

  _internalColumns!: ISummaryColumn[];
  summaryRow: any = {};

  ngOnChanges(): void {
    if (!this.columns || !this.rows) {
      return;
    }
    this.updateInternalColumns();
    this.updateValues();
  }

  private updateInternalColumns(): void {
    this._internalColumns = this.columns.map((col) => ({
      ...col,
      cellTemplate: col.summaryTemplate,
    }));
  }

  private updateValues(): void {
    this.summaryRow = {};

    this.columns
      .filter((col) => !col.summaryTemplate)
      .forEach((col) => {
        const cellsFromSingleColumn = this.rows.map((row) => row[col.prop]);
        const sumFunc = this.getSummaryFunction(col);

        this.summaryRow[col.prop] = col.pipe
          ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
          : sumFunc(cellsFromSingleColumn);
      });
  }

  private getSummaryFunction(column: ISummaryColumn): (a: any[]) => any {
    if (column.summaryFunc === undefined) {
      return defaultSumFunc;
    } else if (column.summaryFunc === null) {
      return noopSumFunc;
    } else {
      return column.summaryFunc;
    }
  }
}
