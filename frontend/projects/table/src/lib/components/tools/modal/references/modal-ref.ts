import { Observable, Subject } from 'rxjs';

export class ModalRef<T, D = unknown> {
  private readonly _afterClosed = new Subject<T>();
  afterClosed: Observable<T> = this._afterClosed.asObservable();

  private readonly _afterOk = new Subject<T>();
  afterOk: Observable<T> = this._afterOk.asObservable();

  private readonly _onEvent = new Subject<D>();
  onEvent: Observable<D> = this._onEvent.asObservable();

  close(result: T): void {
    this._afterClosed.next(result);
  }

  ok(result: T): void {
    this._afterOk.next(result);
  }

  onEventSend(result: D): void {
    this._onEvent.next(result);
  }
}
