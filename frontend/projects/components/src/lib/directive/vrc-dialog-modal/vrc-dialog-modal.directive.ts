import {
  ComponentRef,
  Directive,
  OnDestroy,
  OnInit,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { VrcModalService } from '../../services/vrc-modal.service';
import { Stack } from '../../shared/stack/stack';

@Directive({
  selector: 'ng-template[vrcDialogModal]',
})
export class VrcDialogModalDirective implements OnInit, OnDestroy {
  private readonly _subs: Subscription[] = [];
  private _subsChangeModel = new Stack<Subscription>();
  private _dialogModalRef!: ComponentRef<unknown>;

  private _isOverlayCancel = false;

  get subChangeModel(): Subscription {
    return this._subsChangeModel.peek() as Subscription;
  }

  constructor(
    private readonly _viewContainerRef: ViewContainerRef,
    private readonly _rederer: Renderer2,
    private readonly _vrcModalService: VrcModalService,
  ) {}

  ngOnInit(): void {
    this.onOpen();
    this.onClose();
  }

  onOpen(): void {
    const sub = this._vrcModalService?.open$.subscribe((component) => {
      this.createDynamicComponent(component);
      this.onChangeModal();
    });

    this._subs.push(sub);
  }

  onChangeModal(): void {
    const sub = this._vrcModalService?.options$.subscribe((options) => {
      this.setInputFromOptions(options as { isOverlayCancel?: boolean });
    });

    this._subsChangeModel.push(sub);
  }

  onClose(): void {
    const sub = this._vrcModalService?.close$.subscribe((_) => {
      this.subChangeModel.unsubscribe();
      this.destroyDynamicComponent();
    });

    this._subs.push(sub);
  }

  private createDynamicComponent(component: Type<unknown>): void {
    if (component) {
      this._dialogModalRef = this._viewContainerRef.createComponent(component);
      this.setStyleDefaultDynamicComponent();
      this.addModalMainContainerEventListener();
    }
  }

  private setStyleDefaultDynamicComponent(): void {
    const nativeElement = this._dialogModalRef.location
      .nativeElement as HTMLElement;

    this._rederer.setStyle(nativeElement, 'position', 'fixed');
    this._rederer.setStyle(nativeElement, 'zIndex', '9000');
    this._rederer.setAttribute(nativeElement, 'id', 'modal-main-container');
    this._rederer.addClass(nativeElement, 'modal-main-container');

    this._rederer.setStyle(nativeElement, 'width', '100%');
    this._rederer.setStyle(nativeElement, 'height', '100%');

    this._rederer.setStyle(nativeElement, 'display', 'flex');
    this._rederer.setStyle(nativeElement, 'align-items', 'center');
    this._rederer.setStyle(nativeElement, 'justify-content', 'center');
    this._rederer.setStyle(nativeElement, 'background-color', '#00000030');

    this._rederer.setStyle(nativeElement, 'margin', '0 auto');
  }

  private setInputFromOptions(options: { isOverlayCancel?: boolean }): void {
    this._isOverlayCancel = !!options?.isOverlayCancel;
    Object.assign(this._dialogModalRef.instance as object, options);
  }

  private addModalMainContainerEventListener(): void {
    const nativeElement = this._dialogModalRef.location
      .nativeElement as HTMLElement;
    nativeElement.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;

      if (
        target.classList.contains('modal-main-container') &&
        this._isOverlayCancel
      ) {
        this._vrcModalService.onClose();
      }
    });
  }

  private destroyDynamicComponent(): void {
    this._subsChangeModel.pop();
    this._viewContainerRef.remove();
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this._subsChangeModel.size(); i++) {
      const sub = this._subsChangeModel.pop() as Subscription;
      sub.unsubscribe();
    }
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
