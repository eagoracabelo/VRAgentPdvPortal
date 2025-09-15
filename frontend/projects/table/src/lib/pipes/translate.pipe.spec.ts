import { TranslatePipe } from './translate.pipe';

import { TestBed } from '@angular/core/testing';
import { TranslationService } from '../services/translation.service';
import { ChangeDetectorRef } from '@angular/core';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let translationService: TranslationService;
  let cd: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslatePipe],
      providers: [
        TranslationService,
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
      ],
    }).compileComponents();

    translationService = TestBed.inject(TranslationService);
    cd = TestBed.inject(ChangeDetectorRef);
    pipe = new TranslatePipe(translationService, cd);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform', () => {
    spyOn(cd, 'markForCheck').and.callThrough();
    translationService.loadTranslation('pt-BR').subscribe();
    expect(pipe.transform('TESTE')).toBe('TRABALHANDO');
  });
});
