import { Pipe, PipeTransform } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ETokens } from '../shared';
import { VrcTranslatorPipe } from './translator.pipe';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcTranslatorPipe - NOT TRANSLATE', () => {
  let pipe: VrcTranslatorPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VrcTranslatorPipe],
    });
    pipe = TestBed.inject(VrcTranslatorPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should throw an error if VrcTranslatorPipe is not found', () => {
    try {
      pipe.transform('test');
    } catch (error: any) {
      expect(error.message).toEqual('TranslatorPipe not found');
    }
  });
});

describe('VrcTranslatorPipe - TRANSLATE', () => {
  let pipe: VrcTranslatorPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VrcTranslatorPipe,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    });
    pipe = TestBed.inject(VrcTranslatorPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should throw an error if VrcTranslatorPipe is not found', () => {
    const retult = pipe.transform('test');
    expect(retult).toEqual('test');
  });
});
