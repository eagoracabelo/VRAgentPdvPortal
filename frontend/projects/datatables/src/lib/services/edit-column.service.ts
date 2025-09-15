import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IStorageColumn } from '../interfaces/storage-column.interface';

@Injectable({
  providedIn: 'root',
})
export class EditColumnService {
  private readonly _tempEditColumn = new Subject<IStorageColumn[]>();

  get tempEditColumn$(): Observable<IStorageColumn[]> {
    return this._tempEditColumn.asObservable();
  }

  set tempEditColumn(temp: IStorageColumn[]) {
    this._tempEditColumn.next(temp);
  }

  setTempEditColumn(temp: IStorageColumn[]): void {
    this._tempEditColumn.next(temp);
  }
}
