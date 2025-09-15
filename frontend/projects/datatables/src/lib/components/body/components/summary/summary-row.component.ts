/* eslint-disable */
import { CurrencyPipe } from '@angular/common';
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
  summaryCurrency?: boolean;

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
  selector: 'datatable-summary-row',
  templateUrl: './summary-row.component.html',
  host: {
    class: 'datatable-summary-row',
  },
})
export class DataTableSummaryRowComponent implements OnChanges {
  @Input() rows!: any[];
  @Input() columns!: ISummaryColumn[];
  @Input() summaryCurrency: boolean = false;

  @Input() rowHeight!: number;
  @Input() offsetX!: number;
  @Input() innerWidth!: number;

  _internalColumns!: ISummaryColumn[];
  summaryRow: any = {};

  constructor(private readonly currencyPipe: CurrencyPipe) {}

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
        if (col.summaryCurrency) {
          const cellsFromSingleColumn = this.rows.map((row) => row[col.prop]);
          const sumFunc = this.getSummaryFunction(col);

          this.summaryRow[col.prop] = col.pipe
            ? col.pipe.transform(sumFunc(cellsFromSingleColumn))
            : sumFunc(cellsFromSingleColumn);

          const summary = this.summaryRow[col.prop];

          if (summary) {
            const currency = this.currencyPipe.transform(summary, 'BRL');

            this.summaryRow[col.prop] = this.summaryCurrency
              ? currency
              : summary;
          }
        }
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
