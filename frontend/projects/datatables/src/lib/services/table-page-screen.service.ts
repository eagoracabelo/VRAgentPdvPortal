import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TablePageScreen {
  /**
   * Recalculates the sizes of the page
   */
  calcPageSize =
    (val: unknown[]) =>
    (isCalcSize: boolean) =>
    (
      bodyHeight: number,
      rowHeight: number,
      limit: number | undefined,
    ): number => {
      // Keep the page size constant even if the row has been expanded.
      // This is because an expanded row is still considered to be a child of
      // the original row.  Hence calculation would use rowHeight only.
      let size = val?.length ?? 0;
      if (isCalcSize) {
        size = this.calcSize(bodyHeight, rowHeight);
      }

      // if limit is passed, we are paging
      if (limit !== undefined) {
        size = limit;
      }

      return size;
    };

  private calcSize(bodyHeight: number, rowHeight: number): number {
    const size = Math.ceil(bodyHeight / rowHeight);
    return Math.max(size, 0);
  }

  calcRowCount =
    (val: unknown[]) =>
    (externalPaging: boolean, defaultCount: number) =>
    (groupedRows: { key: unknown; value: unknown[] }[]) =>
    (isValidTree: boolean, internalRowsLength: number): number => {
      let count = externalPaging ? defaultCount : (val?.length ?? 0);

      if (val) {
        if (groupedRows) {
          count = groupedRows.flatMap((g) => g.value).length;
        }

        if (isValidTree) {
          count = internalRowsLength;
        }
      }

      return count;
    };
}
