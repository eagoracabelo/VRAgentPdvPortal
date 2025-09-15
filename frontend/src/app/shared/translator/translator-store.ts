import { EventEmitter } from '@angular/core';
import { Translator } from '../interfaces/translator';

export class TranslatorStore {
  public defaultLang!: string;

  public currentLang: string = this.defaultLang;

  public translations: Record<string, unknown> = {};

  public langs: Array<string> = [];

  public onTranslationChange: EventEmitter<Translator> =
    new EventEmitter<Translator>();
}
