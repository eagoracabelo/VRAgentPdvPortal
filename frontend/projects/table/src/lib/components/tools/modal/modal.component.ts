import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';

import { ModalDirective } from './directives/modal.directive';
import { ModalRef } from './references/modal-ref';

@Component({
  selector: 'table-tool-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  private componentRef!: ComponentRef<unknown>;

  @ViewChild(ModalDirective, { static: true })
  insertionPoint!: ModalDirective;

  private readonly _onClose = new Subject<unknown>();
  public onClose = this._onClose.asObservable();

  private readonly _onOk = new Subject<unknown>();
  public onOk = this._onOk.asObservable();

  childComponentType!: Type<unknown>;
  isFullBackground = true;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly modalRef: ModalRef<unknown>,
  ) {}

  ngAfterViewInit(): void {
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }

  onOverlayClicked(): void {
    this.modalRef.close(true);
  }

  cancelar(): void {
    this.modalRef.close(true);
  }

  onModalClicked(evt: MouseEvent): void {
    evt.stopPropagation();
  }

  loadChildComponent(componentType: Type<unknown>): void {
    const viewContainerRef = this.insertionPoint.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentType);
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  close(): void {
    this._onClose.next(true);
  }

  ok(): void {
    this._onOk.next(true);
  }
}
