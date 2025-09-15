import { inject, TestBed } from '@angular/core/testing';

import { TextEditorService } from './vrc-text-editor.service';

describe('VrcTextEditorService', () => {
  let service: TextEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextEditorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created', inject(
    [TextEditorService],
    (service: TextEditorService) => {
      expect(service).toBeTruthy();
    },
  ));

  it('should get options', () => {
    const options = service.options;
    expect(options).toBeDefined();
  });

  it('should set options', () => {
    const spy = spyOn(service, 'setOptions').and.callThrough();

    const optionChanges = { placeholder: 'Testando' };

    service.setOptions(optionChanges);

    service.onToggleActive();

    const options = service.options;
    expect(spy).toHaveBeenCalled();
    expect(options.placeholder).toEqual(optionChanges.placeholder);
  });

  it('should toggle Active', () => {
    const spy = spyOn(service, 'onToggleActive').and.callThrough();
    let calls = 0;

    service.toggleActive$.subscribe(() => {
      {
        calls += 1;
        expect(spy).toHaveBeenCalled();
      }
    });

    service.onToggleActive();
    expect(calls).toBe(1);
  });

  it('should get Active', () => {
    const active = service.toggleActive$;
    expect(active).toBeDefined();
  });

  describe('document actions', () => {
    it('should execute a documentCommand', () => {
      const spy = spyOn(document, 'execCommand');

      const command = 'bold';
      const value = 'value';
      service.executeDocumentCommand(command, value);

      expect(spy).toHaveBeenCalledWith(command, false, value);
    });

    it('should get a documentSelection', () => {
      const spy = spyOn(document, 'getSelection').and.callThrough();

      const paragrafo = document.createElement('p');
      paragrafo.innerHTML = 'teste';
      paragrafo.id = 'paragrafo';

      const range = document.createRange();
      range.selectNodeContents(paragrafo);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      service.getDocumentSelection();
      expect(spy).toHaveBeenCalled();
    });

    it('should return if there is a command state in document', () => {
      const spy = spyOn(document, 'queryCommandState');

      service.checkDocumentStateCommand('bold');

      expect(spy).toHaveBeenCalled();
    });

    it('should get an element by its id', () => {
      const spy = spyOn(document, 'getElementById');

      const button = document.createElement('button');
      button.id = 'testButton';

      service.getDocumentElementById('testButton');

      expect(spy).toHaveBeenCalled();
    });
  });
});
