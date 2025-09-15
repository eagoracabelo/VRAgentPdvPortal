import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrcModalService } from '../../../services/vrc-modal.service';
import { VrCommonModule } from '../../../vr-common.module';
import { VrcDialogModalModule } from '../../vrc-dialog-modal';
import { VrcInputModule } from '../../vrc-input';

import { VrcTextEditorLinkModalComponent } from './vrc-text-editor-link-modal.component';

describe('VrcTextEditorLinkModalComponent', () => {
  let component: VrcTextEditorLinkModalComponent;
  let fixture: ComponentFixture<VrcTextEditorLinkModalComponent>;
  let modalService: VrcModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VrcTextEditorLinkModalComponent],
      imports: [
        VrcInputModule,
        VrcDialogModalModule,
        FormsModule,
        ReactiveFormsModule,
        VrCommonModule,
      ],
      providers: [VrcModalService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTextEditorLinkModalComponent);
    modalService = TestBed.inject(VrcModalService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onConfirm', () => {
    it('should call onConfirm', () => {
      const spy = spyOn(modalService, 'onConfirm');
      component.onConfirm();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should call onCancel', () => {
      const spy = spyOn(modalService, 'onCancel');
      component.onCancel();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onClose', () => {
    it('should call onClose', () => {
      const spy = spyOn(modalService, 'onClose');
      component.onClose();
      expect(spy).toHaveBeenCalled();
    });
  });
});
