import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs';
import { DataType } from '../model/data-type';
import { Page } from '../model/page';
import { PagedData } from '../model/paged-data';

export const getResultsDataTypes = (
  page: Page,
): Observable<PagedData<DataType>> => {
  const dados: DataType[] = [
    new DataType(
      1,
      3,
      123.2,
      'Texto',
      1,
      '13506770',
      '44425743830',
      '08076873000190',
      '12345678',
      '123456789',
      '2022-06-15 22:49:47.28912',
      '2022-06-15 22:49:47.28912',
      '2022-06-15 22:49:47.28912',
      '19999999999',
      '1270010000',
    ),
    new DataType(
      259,
      42597,
      123.2,
      'Texto',
      1,
      '13506770',
      '44425743830',
      '08076873000190',
      '12345678',
      '123456789',
      '2022-06-15 22:49:47.28912',
      '2022-06-15 22:49:47.28912',
      '2022-06-15 22:49:47.28912',
      '1999999999',
      '1270010000',
    ),
  ];
  return of(dados)
    .pipe(map(() => getPagedDataTypes(page, dados)))
    .pipe(delay(500 * Math.random()));
};

const getPagedDataTypes = (
  page: Page,
  dados: DataType[],
): PagedData<DataType> => {
  const pagedData = new PagedData<DataType>();
  page.totalElements = dados.length;
  const totalP = page.totalElements / page.size;
  page.totalPages = totalP < 1 ? 1 : totalP;
  dados.forEach((d) => pagedData.data.push(d));
  pagedData.page = page;
  return pagedData;
};
