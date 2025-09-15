import {
  forwardRef,
  Inject,
  Optional,
  Pipe,
  PipeTransform,
} from '@angular/core';

import { TranslatorPipeImpl } from '../classes/translator-pipe';
import { ETokens } from '../enums/tokens.enum';

@Pipe({
  name: 'vrdtranslator',
  pure: true,
})
export class TranslatorPipe implements PipeTransform {
  constructor(
    @Optional()
    @Inject(forwardRef(() => ETokens.TRANSLATOR_TOKEN))
    protected readonly _translatorPipe?: TranslatorPipeImpl,
  ) {}

  transform(value: string): string {
    if (!this._translatorPipe) {
      return value;
    }

    return this._translatorPipe.transform(value);
  }
}
