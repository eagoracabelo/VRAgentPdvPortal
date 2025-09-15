import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VrcSideModalService {
  private _isActive = new BehaviorSubject<boolean>(false);

  get isActive(): Observable<boolean> {
    return this._isActive.asObservable();
  }

  setIsActive(value: boolean): void {
    this._isActive.next(value);
  }
}
