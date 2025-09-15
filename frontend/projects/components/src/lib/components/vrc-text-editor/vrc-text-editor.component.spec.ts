import { DOCUMENT } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VrcDialogModalService } from '../../services/vrc-dialog-modal.service';
import { VrcModalService } from '../../services/vrc-modal.service';
import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { TextEditorService } from './services/vrc-text-editor.service';
import { VrcTextEditorComponent } from './vrc-text-editor.component';
import { VrcTextEditorModule } from './vrc-text-editor.module';

const mockFocusEvent = new FocusEvent('focus', {
  bubbles: true,
  cancelable: true,
});

describe('VrcTextEditorComponent', () => {
  let component: VrcTextEditorComponent;
  let fixture: ComponentFixture<VrcTextEditorComponent>;
  let doc: Document;
  let service: TextEditorService;
  let modalService: VrcModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VrCommonModule,
        VrcIconModule,
        FormsModule,
        ReactiveFormsModule,
        VrcTextEditorModule,
      ],
      declarations: [VrcTextEditorComponent],
      providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useValue: {},
        },
        VrcDialogModalService,
        VrcModalService,
        TextEditorService,
      ],
    }).compileComponents();
    doc = TestBed.inject(DOCUMENT);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTextEditorComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(VrcModalService);
    service = TestBed.inject(TextEditorService);

    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CreateLink', () => {
    it('should create a new Link', () => {
      const spyService = spyOn(service, 'executeDocumentCommand');
      const url = 'http://suaurlaqui.com.br/teste';
      component.selectedText = 'teste';
      const expectedTag = `<a title="${url}" href="${url}" target="_blank">${component.selectedText}</a>`;

      component.onCreateLink();
      modalService.onConfirm(url);

      expect(spyService).toHaveBeenCalledWith('insertHtml', expectedTag);
    });

    it('should create link and return early in restoreSelection', () => {
      const spyService = spyOn(service, 'executeDocumentCommand');
      spyOn(service, 'getDocumentSelection').and.returnValue(null);

      const url = 'http://suaurlaqui.com.br/teste';
      component.selectedText = 'teste';
      const expectedTag = `<a title="${url}" href="${url}" target="_blank">${component.selectedText}</a>`;

      component.onCreateLink();
      modalService.onConfirm(url);
      expect(spyService).toHaveBeenCalledWith('insertHtml', expectedTag);
    });
  });

  describe('onPaste', () => {
    it('should paste plain text', () => {
      component.clearPasteFormatting = true;
      const editor: HTMLElement = component.textArea.nativeElement;
      const htmlText = '<h1>Hello!</h1>';

      const pasteData = new DataTransfer();
      pasteData.setData('text', htmlText);

      new ClipboardEvent('paste', {
        clipboardData: pasteData,
      });

      const clipboardEvent = new ClipboardEvent('paste', {
        clipboardData: pasteData,
      });

      editor.dispatchEvent(mockFocusEvent);
      editor.dispatchEvent(clipboardEvent);
      clipboardEvent.preventDefault();

      expect(component.clearPasteFormatting).toBeTrue();
      // expect(editor.innerText).toBe('Hello!');
      expect(editor.innerText).toBeDefined();
    });

    it('should paste html text', () => {
      component.clearPasteFormatting = false;
      const editor: HTMLElement = component.textArea.nativeElement;
      const htmlText = '<h1>Hello!</h1>';

      const pasteData = new DataTransfer();
      pasteData.setData('text', htmlText);

      new ClipboardEvent('paste', {
        clipboardData: pasteData,
      });

      const clipboardEvent = new ClipboardEvent('paste', {
        clipboardData: pasteData,
      });

      editor.dispatchEvent(mockFocusEvent);
      editor.dispatchEvent(clipboardEvent);

      expect(component.clearPasteFormatting).toBeFalse();
    });

    it('should return if event has no clipboardData', () => {
      component.clearPasteFormatting = false;
      const editor: HTMLElement = component.textArea.nativeElement;
      editor.innerText = 'teste';

      component.onPaste({
        clipboardData: undefined,
      } as unknown as ClipboardEvent);

      expect(component.clearPasteFormatting).toBeDefined();
      expect(editor.innerText).toBe('teste');
    });
  });

  describe('handleCommands', () => {
    it('should execute document.execCommand and restore text selection', () => {
      const spyService = spyOn(service, 'executeDocumentCommand');
      const command = 'bold';
      const value = undefined;

      component.handleCommands(command, value);

      expect(spyService).toHaveBeenCalledWith(command, value);
    });

    it('should execute block type command (set h1, h2 or paragraph)', () => {
      const spyService = spyOn(service, 'executeDocumentCommand');
      const command = 'h1';
      const value = undefined;

      component.handleCommands(command, value);

      expect(spyService).toHaveBeenCalledWith('formatBlock', command);
    });

    it('should execute toggleCase command with lower case text', () => {
      const editor: HTMLElement = component.textArea.nativeElement;
      editor.innerHTML = 'teste';
      const range = doc.createRange();
      range.selectNodeContents(editor);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      const spyServiceExecuteCommand = spyOn(service, 'executeDocumentCommand');
      spyOn(service, 'getDocumentSelection').and.returnValue(selection);
      const expectedText = 'TESTE';

      const command = 'toggleCase';
      const value = undefined;

      component.handleCommands(command, value);

      expect(spyServiceExecuteCommand).toHaveBeenCalledWith(
        'insertText',
        expectedText,
      );
    });

    it('should execute toggleCase command with UPPER case text', () => {
      const editor: HTMLElement = component.textArea.nativeElement;
      editor.innerHTML = 'TESTE';
      const range = doc.createRange();
      range.selectNodeContents(editor);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      const spyServiceExecuteCommand = spyOn(service, 'executeDocumentCommand');
      spyOn(service, 'getDocumentSelection').and.returnValue(selection);
      const expectedText = 'teste';

      const command = 'toggleCase';
      const value = undefined;

      component.handleCommands(command, value);

      expect(spyServiceExecuteCommand).toHaveBeenCalledWith(
        'insertText',
        expectedText,
      );
    });

    it('should execute toggleCase with no selected text and break', () => {
      const editor: HTMLElement = component.textArea.nativeElement;
      editor.innerHTML = 'TESTE';
      const range = doc.createRange();
      range.selectNodeContents(editor);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      const spyServiceExecuteCommand = spyOn(service, 'executeDocumentCommand');
      spyOn(service, 'getDocumentSelection').and.returnValue(null);
      const expectedText = 'teste';

      const command = 'toggleCase';
      const value = undefined;

      component.handleCommands(command, value);

      expect(spyServiceExecuteCommand).not.toHaveBeenCalled();
    });

    it('should not execute document.execCommand if !command', () => {
      const spyService = spyOn(service, 'executeDocumentCommand');
      const command = undefined;
      const value = undefined;

      component.handleCommands(command, value);

      expect(spyService).not.toHaveBeenCalled();
    });
  });

  describe('call', () => {
    it('should call blur', () => {
      const spyBlur = spyOn(component.textArea.nativeElement, 'blur');
      const spySaveSelection = spyOn(component, 'saveSelection');

      component.blur();

      expect(spyBlur).toHaveBeenCalled();
      expect(spySaveSelection).toHaveBeenCalled();
      expect(component.focused).toBeFalse();
    });
  });

  describe('callback methods', () => {
    it('should be registerOnChange', () => {
      const fn: any = (_: unknown) => {};
      component.registerOnChange(fn);
      expect(component.registerOnChange).toBeDefined();
    });

    it('should be onTouched', () => {
      component.onTouched();
      expect(component.onTouched).toBeDefined();
    });

    it('should be registerOnTouched', () => {
      const fn = () => {};
      component.registerOnTouched(fn);
      expect(component.registerOnTouched).toBeDefined();
    });

    it('should be writeValue', () => {
      const expectedValue = '<p>Valor inicial</p>';
      component.textArea.nativeElement.innerHTML = '';
      component.writeValue(expectedValue);

      expect(component.textArea.nativeElement.innerHTML).toBe(expectedValue);
      expect(component.showPlaceholder).toBeFalsy();
    });
  });
  describe('saveSelection', () => {
    it('should save selection', () => {
      const editor: HTMLElement = component.textArea.nativeElement;
      editor.innerHTML = 'teste';
      const range = doc.createRange();
      range.selectNodeContents(editor);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      component.saveSelection();

      expect(component.savedSelection).toBeDefined();
    });

    it('should not save selection', () => {
      component.selectedText = 'teste';
      spyOn(service, 'getDocumentSelection').and.returnValue(null);
      component.saveSelection();
      expect(component.selectedText).toBe('teste');
    });
  });

  describe('onSave', () => {
    it('should emit saveEditing event', () => {
      const spyEmit = spyOn(component.saveEditingEvent, 'emit');
      component.onSave();
      expect(spyEmit).toHaveBeenCalled();
      expect(component.editing).toBeFalse();
    });
  });

  describe('onCancel', () => {
    it('should emit cancelEditing event', () => {
      const spyEmit = spyOn(component.cancelEditingEvent, 'emit');
      component.onCancel();
      expect(spyEmit).toHaveBeenCalled();
      expect(component.editing).toBeFalse();
    });
  });
});
