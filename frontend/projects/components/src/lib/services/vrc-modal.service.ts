import { Injectable, Type } from '@angular/core';
import { filter, Observable, Subject, switchMap } from 'rxjs';
import { Stack } from '../shared/stack/stack';

@Injectable({
  providedIn: 'root',
})
export class VrcModalService {
  private _modals = new Stack<Modal<unknown>>();
  private readonly _subjectStatus = new Subject<boolean>();

  get modal(): Modal<unknown> {
    return this._modals.peek() as Modal<unknown>;
  }

  get open$(): Observable<Type<unknown>> {
    return this._subjectStatus.asObservable().pipe(
      filter((status) => status),
      switchMap(() => {
        return this.modal.component$;
      }),
    );
  }

  get close$(): Observable<unknown> {
    return this._subjectStatus.asObservable().pipe(filter((status) => !status));
  }

  get confirm$(): Observable<unknown> {
    return this.modal.confirm$;
  }

  get cancel$(): Observable<unknown> {
    return this.modal.cancel$;
  }

  get options$(): Observable<unknown> {
    return this.modal.options$;
  }

  onOpen<T = unknown>(component: Type<T>, options?: unknown): Modal<T> {
    const modal = new Modal(component, options);
    this._modals.push(modal);
    this._subjectStatus.next(true);
    modal.emit();
    return modal;
  }

  onClose(): void {
    this.modal.onClose();
    this._subjectStatus.next(false);
    this._modals.pop();
  }

  onConfirm(data: unknown): void {
    this.modal.onConfirm(data);
    this.onClose();
  }

  onConfirmAndNotClose(data: unknown): void {
    this.modal.onConfirm(data);
  }

  onCancel(data: unknown): void {
    this.modal.onCancel(data);
    this.onClose();
  }
}

export class Modal<T> {
  private readonly _subjectComponent = new Subject<Type<unknown>>();
  private readonly _subjectOptions = new Subject<unknown>();

  private readonly _subjectConfirm = new Subject<unknown>();
  private readonly _subjectCancel = new Subject<unknown>();
  private readonly _subjectClose = new Subject<unknown>();

  constructor(
    private readonly _component: Type<T>,
    private readonly _options: unknown,
  ) {}

  emit(): void {
    this._subjectComponent.next(this._component);
    this._subjectOptions.next(this._options);
  }

  get component$(): Observable<Type<unknown>> {
    return this._subjectComponent.asObservable();
  }

  get options$(): Observable<unknown> {
    return this._subjectOptions.asObservable();
  }

  get confirm$(): Observable<unknown> {
    return this._subjectConfirm.asObservable();
  }

  get cancel$(): Observable<unknown> {
    return this._subjectCancel.asObservable();
  }

  get close$(): Observable<unknown> {
    return this._subjectClose.asObservable();
  }

  onConfirm(data: unknown): void {
    this._subjectConfirm.next(data);
  }

  onCancel(data: unknown): void {
    this._subjectCancel.next(data);
  }

  onClose(): void {
    this._subjectClose.next(true);
  }
}
