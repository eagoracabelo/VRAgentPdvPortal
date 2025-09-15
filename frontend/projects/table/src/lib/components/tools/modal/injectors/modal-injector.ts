import { InjectionToken, Injector, Type } from '@angular/core';

import { ModalRef } from '../references/modal-ref';

export class ModalInjector implements Injector {
  constructor(
    private readonly _parentInjector: Injector,
    private readonly _additionalTokens: WeakMap<
      Type<ModalRef<unknown>> | InjectionToken<ModalRef<unknown>>,
      unknown
    >,
  ) {}

  get<T extends ModalRef<unknown>>(
    token: Type<T> | InjectionToken<T>,
    notFoundValue?: T,
    flags?: unknown,
  ): unknown;

  get<T extends ModalRef<unknown>>(
    token: Type<T> | InjectionToken<T>,
    notFoundValue?: unknown,
  ): unknown;

  get<T extends ModalRef<unknown>>(
    token: Type<T> | InjectionToken<T>,
    notFoundValue?: T,
  ): unknown {
    const value = this._additionalTokens.get(token);

    if (value) {
      return value;
    }

    return this._parentInjector.get<ModalRef<unknown>>(token, notFoundValue);
  }
}
