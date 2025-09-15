/* eslint-disable */
import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import contactData from '../../../../../../public/table/data/contact.json';
import personData from '../../../../../../public/table/data/person.json';
import { Contact } from '../model/contact';
import { Person } from '../model/person';

/**
 * A server used to mock a paged data result from a server
 */
@Injectable()
export class MockServerResultsService {
  public getResultsJson(count = 100): Observable<Contact[]> {
    return of(contactData)
      .pipe(map(() => this.getDataJson(count)))
      .pipe(delay(500 * Math.random()));
  }

  private getDataJson(count = 100): Contact[] {
    const data: any = Object.assign([{}], contactData);
    const result: Contact[] = [];
    for (let index = 0; index < count; index++) {
      result.push(data[index]);
    }

    return result;
  }
  public getResultsObjectJson(count = 100): Observable<Person[]> {
    return of(personData)
      .pipe(map(() => this.getDataObjectJson(count)))
      .pipe(delay(500 * Math.random()));
  }

  private getDataObjectJson(count = 100): Person[] {
    const data: any = Object.assign([{}], personData);
    const result: Person[] = [];
    for (let index = 0; index < count; index++) {
      result.push(data[index]);
    }

    return result;
  }
}
