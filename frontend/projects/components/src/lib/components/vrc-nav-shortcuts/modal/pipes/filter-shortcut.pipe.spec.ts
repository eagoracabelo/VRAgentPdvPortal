import { ChangeDetectorRef, EventEmitter, Pipe } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslatorPipeImpl } from './../../../../shared/classes/translator-pipe';
import { ETokens } from './../../../../shared/enums/tokens.enum';
import { ITranslatorEventEmitter } from './../../../../shared/interfaces/translator-event-emitter.interface';

import { IShortcut } from './../interfaces/shortcut.interface';
import { FilterShortcutPipe } from './filter-shortcut.pipe';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements TranslatorPipeImpl {
  get translatorChange(): EventEmitter<ITranslatorEventEmitter> {
    throw new Error('Method not implemented.');
  }

  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('FilterShortcutPipe', () => {
  let changeDetectRef: ChangeDetectorRef;
  let translatorPipe: TranslatorPipe;

  let shortcuts: IShortcut[] = [
    {
      keys: ['Alt', 'S'],
      label: 'ATALHOS.SALVAR-FORMULARIO',
    },
  ];

  const mockChangeDetectorRef = {
    markForCheck: () => {
      /** empty */
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipe,
        },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    });
    changeDetectRef = TestBed.inject(ChangeDetectorRef);
    translatorPipe = new TranslatorPipe();
  });

  it('create an instance', () => {
    const pipe = new FilterShortcutPipe(translatorPipe);
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should be return value 1 in filter Alt', fakeAsync(() => {
      const pipe = new FilterShortcutPipe(translatorPipe);
      const expected = pipe.transform(shortcuts, 'Alt');
      tick(1000);

      expect(expected.length).toEqual(1);
    }));

    it('should be return 0 if filter not valid', fakeAsync(() => {
      const pipe = new FilterShortcutPipe(translatorPipe);
      const expected = pipe.transform(shortcuts, 'Test');
      tick(1000);

      expect(expected.length).toEqual(0);
    }));
  });
});
