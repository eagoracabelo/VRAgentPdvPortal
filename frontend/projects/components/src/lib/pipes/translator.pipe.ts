import {
  forwardRef,
  Inject,
  Optional,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { ETokens } from '../shared';
import { TranslatorPipeImpl } from '../shared/classes/translator-pipe';

@Pipe({
  name: 'vrctranslator',
  pure: true,
})
export class VrcTranslatorPipe implements PipeTransform {
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
