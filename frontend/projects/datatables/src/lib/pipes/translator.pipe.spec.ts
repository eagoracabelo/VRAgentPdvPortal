import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ETokens } from '../enums/tokens.enum';
import { TranslatorPipe } from './translator.pipe';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('TranslatorPipe - NOT TRANSLATE', () => {
  let pipe: TranslatorPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslatorPipe],
    });
    pipe = TestBed.inject(TranslatorPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should throw an error if TranslatorPipe is not found', () => {
    try {
      pipe.transform('test');
    } catch (error: any) {
      expect(error.message).toEqual('VRD TranslatorPipe not found');
    }
  });
});

describe('TranslatorPipe - TRANSLATE', () => {
  let pipe: TranslatorPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslatorPipe,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    });
    pipe = TestBed.inject(TranslatorPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should throw an error if TranslatorPipe is not found', () => {
    const retult = pipe.transform('test');
    expect(retult).toEqual('test');
  });
});
