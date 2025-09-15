import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VrCommonModule } from '../../../vr-common.module';
import { VrcIconModule } from '../../vrc-icon';
import { TextEditorService } from '../services/vrc-text-editor.service';
import { VrcTextEditorModule } from '../vrc-text-editor.module';

import { VrcTextEditorToolbarComponent } from './vrc-text-editor-toolbar.component';

describe('VrcTextEditorToolbarComponent', () => {
  let component: VrcTextEditorToolbarComponent;
  let fixture: ComponentFixture<VrcTextEditorToolbarComponent>;
  let service: TextEditorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrCommonModule, VrcIconModule, VrcTextEditorModule],
      declarations: [VrcTextEditorToolbarComponent],
      providers: [Document, TextEditorService],
    }).compileComponents();
    service = TestBed.inject(TextEditorService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTextEditorToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('watchToogleToolbarActive', () => {
    it('shoud call toggleToolbarButtonsActiveState on subject next', () => {
      const spyToggleToolbarButtonsActiveState = spyOn(
        component,
        'toggleToolbarButtonsActiveState',
      );

      service.onToggleActive();
      fixture.detectChanges();

      expect(spyToggleToolbarButtonsActiveState).toHaveBeenCalled();
    });

    it('should set class="active" to button', () => {
      spyOn(service, 'checkDocumentStateCommand').and.returnValue(true);

      const botao = fixture.debugElement.query(By.css('#bold-btn'));
      botao.nativeElement.click();
      component.toggleToolbarButtonsActiveState();

      expect(botao.nativeElement.classList).toContain('active');
    });

    it('should remove class="active" from button', () => {
      spyOn(service, 'checkDocumentStateCommand').and.returnValue(false);

      const botao = fixture.debugElement.query(By.css('#bold-btn'));
      botao.nativeElement.classList.add('active');
      botao.nativeElement.click();
      component.toggleToolbarButtonsActiveState();

      expect(botao.nativeElement.classList).not.toContain('active');
    });

    it('should not add class="active" if button reference is not found', () => {
      spyOn(service, 'checkDocumentStateCommand').and.returnValue(true);
      spyOn(service, 'getDocumentElementById').and.returnValue(null);

      const botao = fixture.debugElement.query(By.css('#bold-btn'));
      botao.nativeElement.click();
      component.toggleToolbarButtonsActiveState();

      expect(botao.nativeElement.classList).not.toContain('active');
    });

    it('should not remove class="active" if button reference is not found', () => {
      spyOn(service, 'checkDocumentStateCommand').and.returnValue(false);
      spyOn(service, 'getDocumentElementById').and.returnValue(null);

      const botao = fixture.debugElement.query(By.css('#bold-btn'));
      botao.nativeElement.classList.add('active');
      botao.nativeElement.click();
      component.toggleToolbarButtonsActiveState();

      expect(botao.nativeElement.classList).toContain('active');
    });
  });

  describe('onExecute', () => {
    it('should emit command event after call onExecute', () => {
      const spyExecute = spyOn(component.execute, 'emit');

      component.onExecute('bold');

      expect(spyExecute).toHaveBeenCalled();
      expect(spyExecute).toHaveBeenCalledWith('bold');
    });

    it('should return if command is not defined', () => {
      const spyExecute = spyOn(component.execute, 'emit');

      component.onExecute(null as any);

      expect(spyExecute).not.toHaveBeenCalled();
    });
  });

  describe('create link', () => {
    it('should emit openCreateLink', () => {
      const spy = spyOn(component.openCreateLink, 'emit');

      component.onInsertUrl();

      expect(spy).toHaveBeenCalled();
    });
  });
});
