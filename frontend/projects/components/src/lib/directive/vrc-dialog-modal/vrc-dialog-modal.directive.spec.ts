import { Component, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal, VrcModalService } from '../../services/vrc-modal.service';
import { VrcDialogModalDirective } from './vrc-dialog-modal.directive';

@Component({
  template: `<div id="modal-test" style="width:10px; height:10px">
    <div></div>
  </div>`,
})
class ModalComponentTest {}

@Component({
  template: `<main>
    <div id="test"><ng-template vrcDialogModal></ng-template></div>
  </main>`,
})
class DialogComponentTestOverlayCancelTrue {
  constructor(protected _modalService: VrcModalService) {}

  onOpen(): Modal<unknown> {
    return this._modalService.onOpen(ModalComponentTest, {
      isOverlayCancel: true,
    });
  }
}

@Component({
  template: `<main>
    <div id="test"><ng-template vrcDialogModal></ng-template></div>
  </main>`,
})
class DialogComponentTestOverlayCancelFalse {
  constructor(protected _modalService: VrcModalService) {}

  onOpen(): Modal<unknown> {
    return this._modalService.onOpen(ModalComponentTest, {
      isOverlayCancel: false,
    });
  }
}

describe('DialogDirective', () => {
  let componentOverlayCancelTrue: DialogComponentTestOverlayCancelTrue;
  let componentOverlayCancelFalse: DialogComponentTestOverlayCancelFalse;
  let fixtureOverlayCancelTrue: ComponentFixture<DialogComponentTestOverlayCancelTrue>;
  let fixtureOverlayCancelFalse: ComponentFixture<DialogComponentTestOverlayCancelFalse>;
  let modalService: VrcModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        VrcDialogModalDirective,
        DialogComponentTestOverlayCancelTrue,
        DialogComponentTestOverlayCancelFalse,
        ModalComponentTest,
      ],
      providers: [VrcModalService, Renderer2],
    }).compileComponents();

    fixtureOverlayCancelTrue = TestBed.createComponent(
      DialogComponentTestOverlayCancelTrue,
    );
    fixtureOverlayCancelFalse = TestBed.createComponent(
      DialogComponentTestOverlayCancelFalse,
    );
    componentOverlayCancelTrue = fixtureOverlayCancelTrue.componentInstance;
    componentOverlayCancelFalse = fixtureOverlayCancelFalse.componentInstance;
    modalService = TestBed.inject(VrcModalService);
    fixtureOverlayCancelTrue.detectChanges();
    fixtureOverlayCancelFalse.detectChanges();
  });

  afterEach(() => {
    fixtureOverlayCancelTrue.destroy();
    fixtureOverlayCancelFalse.destroy();
  });

  it('should create an instance', () => {
    expect(componentOverlayCancelTrue).toBeTruthy();
    expect(componentOverlayCancelFalse).toBeTruthy();
  });

  it('should create modal componentOverlayCancelTrue on dialog directive', () => {
    componentOverlayCancelTrue.onOpen();
    expect(document.getElementById('modal-test')).toBeTruthy();
  });

  it('should destroy modal componentOverlayCancelTrue on dialog directive', () => {
    componentOverlayCancelTrue.onOpen();
    expect(document.getElementById('modal-test')).toBeTruthy();

    modalService.onClose();
    expect(document.getElementById('modal-test')).toBeFalsy();
  });

  it('should close modal on click outside', () => {
    componentOverlayCancelTrue.onOpen();
    expect(document.getElementById('modal-test')).toBeTruthy();

    const modal = document.getElementById('modal-main-container');
    const event = new MouseEvent('click', { bubbles: true });
    modal?.dispatchEvent(event);
    expect(document.getElementById('modal-test')).toBeFalsy();
  });

  it('should not close modal on click outside', () => {
    componentOverlayCancelFalse.onOpen();
    expect(document.getElementById('modal-test')).toBeTruthy();

    const modal = document.getElementById('modal-main-container');
    const event = new MouseEvent('click', { bubbles: true });
    modal?.dispatchEvent(event);
    expect(document.getElementById('modal-test')).toBeTruthy();
  });
});
