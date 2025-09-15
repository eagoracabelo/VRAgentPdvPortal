import {
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { merge, take } from 'rxjs';
import { ModalConfig } from '../config/modal-config';

import { ModalInjector } from '../injectors/modal-injector';
import { ModalComponent } from '../modal.component';
import { ModalRef } from '../references/modal-ref';

export class Modal<T, D = unknown> {
  public modalComponentRef!: ComponentRef<ModalComponent>;

  constructor(
    protected readonly injector: Injector,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  public open(
    componentType: Type<unknown>,
    config: ModalConfig,
  ): ModalRef<T, D> {
    const modalRef = this.appendModalComponentToBody(config);
    this.modalComponentRef.instance.childComponentType = componentType;

    return modalRef;
  }

  private appendModalComponentToBody(config: ModalConfig): ModalRef<T, D> {
    const map = new WeakMap();
    map.set(ModalConfig, config);

    const modalRef = this.getNewRef();
    map.set(ModalRef, modalRef);

    // Cria o componente usando ViewContainerRef
    const componentRef = this.viewContainerRef.createComponent(ModalComponent, {
      injector: new ModalInjector(this.injector, map),
    });

    // Anexa o componente ao DOM
    const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>)
      .rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    this.modalComponentRef = componentRef;

    merge(
      modalRef.afterClosed,
      modalRef.afterOk,
      this.modalComponentRef.instance.onClose,
      this.modalComponentRef.instance.onOk,
    )
      .pipe(take(1))
      .subscribe(() => {
        this.removeModalComponentFromBody();
      });

    return modalRef;
  }

  private getNewRef(): ModalRef<T, D> {
    return new ModalRef<T, D>();
  }

  removeModalComponentFromBody(): void {
    this.modalComponentRef.destroy();
  }
}
