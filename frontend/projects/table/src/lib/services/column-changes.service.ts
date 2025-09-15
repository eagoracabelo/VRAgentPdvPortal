import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * service to make TableComponent aware of changes to
 * input bindings of TableColumnDirective
 */
@Injectable()
export class ColumnChangesService {
  private columnInputChanges = new Subject<undefined>();

  get columnInputChanges$(): Observable<undefined> {
    return this.columnInputChanges.asObservable();
  }

  onInputChange(): void {
    this.columnInputChanges.next(undefined);
  }
}
