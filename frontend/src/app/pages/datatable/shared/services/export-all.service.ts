import { Injectable } from '@angular/core';
import { exportFromBrowser } from '@vrsoftbr/vr-file-export';
import { ExportConfig } from '@vrsoftbr/vr-file-export/config/export-config';
import { formatKeyValue } from '@vrsoftbr/vr-file-export/format-key-value';
import { IFileData } from '@vrsoftbr/vr-file-export/shared/ifile-data';
import { IExportAll, TableColumn } from '@vrsoftbr/vrc-datatables';
import { delay, from, map, Observable, of, switchMap, take } from 'rxjs';

import companyData from './../../../../../../public/datatables/data/company.json';

import { getResultsDataTypes } from '../mocks/mock-server-results';
import { CorporateEmployee } from '../model/corporate-employee';
import { DataType } from '../model/data-type';
import { Page } from '../model/page';
import { PagedData } from '../model/paged-data';

@Injectable({
  providedIn: 'root',
})
export class ExportAllService {
  public generateFile(exportAll: IExportAll): Observable<void> {
    return this.file(this.getAllCompanyData(), exportAll);
  }
  setColumnsForByGroupedRowsExport(
    TableColumn:
      | TableColumn[]
      | { prop: string; name: string; label: string }[],
    keyGrouped: string,
  ): Record<string, unknown> {
    const columns: Record<string, unknown> = {
      agrupamento: keyGrouped,
    };
    TableColumn.forEach((column) => {
      if (!column.label) return;

      columns[column.label] = '';
    });
    return columns;
  }

  groupBy(rows: IFileData[], keys: string[]): { [key: string]: IFileData[] } {
    const returnData: { [key: string]: IFileData[] } = {};

    keys.forEach((key) => {
      returnData[key] = [];
    });

    rows.forEach((obj) => {
      if (!obj['agrupamento']) {
        obj['agrupamento'] = '';
      } else if (Array.isArray(obj['agrupamento'])) {
        obj['agrupamento'].unshift('');
      }

      for (const key in obj) {
        if (keys.includes(obj[key] as string)) {
          returnData[obj[key] as string].push(obj);
        }
      }
    });

    return returnData;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private file(cb: Observable<any>, exportAll: IExportAll): Observable<void> {
    return cb.pipe(
      take(1),
      map((rows: unknown[]) => rows as unknown as IFileData[]),
      switchMap((rows) => {
        let correctArray: IFileData[] = [];

        if (exportAll.groupsKeysMapped.length > 0) {
          const groupedColumns = [
            {
              prop: 'agrupamento',
              name: 'Agrupamento',
              label: 'agrupamento',
            },
            ...exportAll.columns,
          ];

          const groupedData = this.groupBy(rows, exportAll.groupsKeysMapped);

          Object.keys(groupedData).forEach((key: string) => {
            const groupingLine = formatKeyValue(
              [this.setColumnsForByGroupedRowsExport(exportAll.columns, key)],
              groupedColumns,
            );

            correctArray.push(...(groupingLine as unknown as IFileData[]));
            const formatedRows = formatKeyValue(
              groupedData[key],
              groupedColumns,
            );

            correctArray.push(...(formatedRows as unknown as IFileData[]));
          });
        } else {
          const formatedRows = formatKeyValue(rows, exportAll.columns);
          correctArray = formatedRows;
        }

        const config = new ExportConfig({
          ...exportAll.options,
          data: correctArray ?? [],
        });

        return from(exportFromBrowser(config));
      }),
    );
  }

  public getAllCompanyData(): Observable<CorporateEmployee[]> {
    return of(companyData).pipe(delay(500 * Math.random()));
  }

  public generateFileDataTypes(exportAll: IExportAll): Observable<void> {
    return this.getAllDataTypes().pipe(
      take(1),
      switchMap((pagedData) => this.file(of(pagedData.data), exportAll)),
    );
  }

  public getAllDataTypes(): Observable<PagedData<DataType>> {
    const page = Object.assign(new Page(), {
      pageNumber: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1,
    });

    return getResultsDataTypes(page);
  }
}
