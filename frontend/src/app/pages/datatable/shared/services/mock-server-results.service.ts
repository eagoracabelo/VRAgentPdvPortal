/* eslint-disable */
import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import bigDataJson from './../../../../../../public/datatables/data/big-data.json';
import companyData from './../../../../../../public/datatables/data/company.json';

import { getResultsDataTypes } from '../mocks/mock-server-results';
import { BigData } from '../model/big-data';
import { CorporateEmployee } from '../model/corporate-employee';
import { Page } from '../model/page';
import { PagedData } from '../model/paged-data';

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class MockServerResultsService {
  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the employee data
   */
  public getResultsBig(page: Page): Observable<PagedData<BigData>> {
    return of(bigDataJson)
      .pipe(map(() => this.getPagedBigData(page)))
      .pipe(delay(500 * Math.random()));
  }
  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the employee data
   */
  public getResults(page: Page): Observable<PagedData<CorporateEmployee>> {
    return of(companyData)
      .pipe(map(() => this.getPagedData(page)))
      .pipe(delay(500 * Math.random()));
  }

  public getResultsFilter(
    page: Page,
  ): Observable<PagedData<CorporateEmployee>> {
    return of(companyData)
      .pipe(map(() => this.getPagedDataFilter(page)))
      .pipe(delay(500 * Math.random()));
  }

  readonly getResultsDataTypes = getResultsDataTypes;
  /**
   * Package companyData into a PagedData object based on the selected Page
   * @param page The page data used to get the selected data from companyData
   * @returns {PagedData<CorporateEmployee>} An array of the selected data and page
   */
  private getPagedData(page: Page): PagedData<CorporateEmployee> {
    const pagedData = new PagedData<CorporateEmployee>();
    const data = Object.assign([{}], companyData);
    if (Object.keys(page.order).length > 0) {
      this.sortResults(data, page.order.column, page.order.dir);
    }

    page.totalElements = data.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = data[i];
      const employee = new CorporateEmployee(
        jsonObj.id,
        jsonObj.name,
        jsonObj.gender,
        jsonObj.company,
        jsonObj.quantity,
        jsonObj.money,
        jsonObj.currency,
        jsonObj.currencyParaguai,
        jsonObj.discount,
        jsonObj.age,
      );
      pagedData.data.push(employee);
    }
    pagedData.page = page;

    return pagedData;
  }

  private sortResults(element: any, prop: any, dir: any) {
    element.sort((a: any, b: any) => {
      if (dir === 'ASC') {
        return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
      } else {
        return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
      }
    });
  }

  /**
   * Package companyData into a PagedData object based on the selected Page
   * @param page The page data used to get the selected data from companyData
   * @returns {PagedData<CorporateEmployee>} An array of the selected data and page
   */
  private getPagedBigData(page: Page): PagedData<BigData> {
    const pagedData = new PagedData<BigData>();
    const data = Object.assign([{}], bigDataJson);
    if (Object.keys(page.order).length > 0) {
      this.sortResults(data, page.order.column, page.order.dir);
    }

    page.totalElements = data.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min(start + page.size, page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = data[i];
      const employee = new BigData(
        jsonObj._id,
        jsonObj.name,
        jsonObj.isActive,
        jsonObj.balance,
        jsonObj.picture,
        jsonObj.age,
        jsonObj.gender,
      );
      pagedData.data.push(employee);
    }
    pagedData.page = page;

    return pagedData;
  }

  private getPagedDataFilter(page: Page): PagedData<CorporateEmployee> {
    const pagedData = new PagedData<CorporateEmployee>();

    const data: any = Object.assign([{}], companyData);
    if (Object.keys(page.order).length > 0) {
      this.sortResults(data, page.order.column, page.order.dir);
    }

    if (Object.keys(page.filter).length > 0) {
      let filteredData: CorporateEmployee[] = [];

      if (page.filter['name']) {
        filteredData = data.filter((c: any) =>
          c.name.includes(page.filter['name'].toString()),
        );
      }

      if (page.filter['company'] && filteredData.length === 0) {
        filteredData = data.filter((c: any) =>
          c.company
            .toLowerCase()
            .includes(page.filter['company'].toString().toLowerCase()),
        );
      } else if (page.filter['company'] && filteredData.length > 0) {
        filteredData = filteredData.filter((c) =>
          c.company
            .toLowerCase()
            .includes(page.filter['company'].toString().toLowerCase()),
        );
      }

      page.totalElements = filteredData.length;
      const totalP = page.totalElements / page.size;
      page.totalPages = totalP < 1 ? 1 : totalP;
      filteredData.forEach((c) => pagedData.data.push(c));
      pagedData.page = page;
    } else {
      page.totalElements = data.length;
      page.totalPages = page.totalElements / page.size;
      const start = page.pageNumber * page.size;
      const end = Math.min(start + page.size, page.totalElements);
      for (let i = start; i < end; i++) {
        const jsonObj = data[i];
        const employee = new CorporateEmployee(
          jsonObj.name,
          jsonObj.gender,
          jsonObj.company,
          jsonObj.quantity,
          jsonObj.money,
          jsonObj.currency,
          jsonObj.currencyParaguai,
          jsonObj.discount,
          jsonObj.age,
        );
        pagedData.data.push(employee);
      }
      pagedData.page = page;
    }

    return pagedData;
  }

  public getResultsServerScrolling(
    offset: number,
    limit: number,
  ): Observable<PagedData<CorporateEmployee>> {
    const pagedData = new PagedData<CorporateEmployee>();
    pagedData.data = companyData.slice(offset, offset + limit);
    return of(pagedData).pipe(delay(new Date(Date.now() + 500)));
  }
}
