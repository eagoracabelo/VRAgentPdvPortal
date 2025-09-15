import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TranslatorPipe } from './translator.pipe';

@Injectable()
@Pipe({
  name: 'translatorText',
  pure: true,
})
export class TranslatorTextPipe implements PipeTransform {
  constructor(private _translatorPipe: TranslatorPipe) {}

  transform(text: string): string {
    const tags = text.match(/(\{[A-Z\d\\-]{2,}\.([A-Z\d\\-]{2,}\.?)+\})/gm);

    try {
      return tags
        ? tags.reduce(
            (acc, tag) => acc?.replace(tag, this.translate(tag)),
            text,
          )
        : this.translate(text);
    } catch {
      return text;
    }
  }

  private translate(tag: string): string {
    return this._translatorPipe.transform(tag?.replace(/[{}]/g, ''));
  }
}
