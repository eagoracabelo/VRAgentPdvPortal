import {
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
} from '@angular/core';
import { isUndefined, merge } from 'lodash';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { StorageKeyEnum } from '../enums/storage-key.enum';
import { Translator } from '../interfaces/translator';
import { TranslatorLoader } from '../translator/translator-loader';
import { TranslatorParser } from '../translator/translator-parser';
import { TranslatorStore } from '../translator/translator-store';

export const USE_STORE = new InjectionToken<string>('USE_STORE');
export const USE_DEFAULT_LANG = new InjectionToken<string>('USE_DEFAULT_LANG');
export const DEFAULT_LANGUAGE = new InjectionToken<string>('DEFAULT_LANGUAGE');
export const USE_EXTEND = new InjectionToken<string>('USE_EXTEND');
declare interface Window {
  navigator: Navigator;
}

declare const window: Window;

@Injectable()
export class TranslatorService implements OnDestroy {
  private _onTranslatorChange: EventEmitter<Translator> =
    new EventEmitter<Translator>();

  private _defaultLang!: string;
  private _currentLang!: string;
  private _langs: Array<string> = [];
  private _translations: Record<string, unknown> = {};

  window = window;

  private _sub!: Subscription;

  constructor(
    @Inject(DEFAULT_LANGUAGE) defaultLanguage: string,
    public translatorStore: TranslatorStore,
    public currentLoader: TranslatorLoader,
    public translatorParser: TranslatorParser,
    @Inject(USE_DEFAULT_LANG) private useDefaultLang: boolean = true,
    @Inject(USE_STORE) private isolate: boolean = false,
    @Inject(USE_EXTEND) private extend: boolean = false,
  ) {
    if (defaultLanguage) {
      this.defaultLang = defaultLanguage;
    }
  }

  get onTranslatorChange(): EventEmitter<Translator> {
    return this.isolate
      ? this._onTranslatorChange
      : this.translatorStore.onTranslationChange;
  }

  get defaultLang(): string {
    return this.isolate ? this._defaultLang : this.translatorStore.defaultLang;
  }

  set defaultLang(defaultLang: string) {
    if (this.isolate) {
      this._defaultLang = defaultLang;
    } else {
      this.translatorStore.defaultLang = defaultLang;
    }
  }

  public getLocalLang(): string | null {
    return localStorage.getItem(StorageKeyEnum.translator);
  }

  get currentLang(): string {
    return this.isolate ? this._currentLang : this.translatorStore.currentLang;
  }

  set currentLang(currentLang: string) {
    if (this.isolate) {
      this._currentLang = currentLang;
    } else {
      this.translatorStore.currentLang = currentLang;
    }
  }

  get langs(): string[] {
    return this.isolate ? this._langs : this.translatorStore.langs;
  }

  set langs(langs: string[]) {
    if (this.isolate) {
      this._langs = langs;
    } else {
      this.translatorStore.langs = langs;
    }
  }

  get translations(): Record<string, unknown> {
    return this.isolate
      ? this._translations
      : this.translatorStore.translations;
  }

  set translations(translations: Record<string, unknown>) {
    if (this.isolate) {
      this._translations = translations;
    } else {
      this.translatorStore.translations = translations;
    }
  }

  public use(lang: string): void {
    if (lang !== this.currentLang) {
      this._sub = forkJoin(this.getTranslation(lang)).subscribe(
        ([FRONTEND]) => {
          this.setTranslation(lang, { FRONTEND });
          this.changeLang(lang);
          this.onTranslatorChange.emit({
            lang: lang,
            translations: this.translations[lang],
          });
          return localStorage.setItem(StorageKeyEnum.translator, lang);
        },
      );
    }
  }

  private getTranslation(lang: string): Observable<unknown>[] {
    return [this.currentLoader.getTranslations(lang).pipe(take(1))];
  }

  public setTranslation(
    lang: string,
    translations: unknown,
    shouldMerge = false,
  ): void {
    if ((shouldMerge || this.extend) && this.translations[lang]) {
      this.translations[lang] = merge(this.translations[lang], translations);
    } else {
      this.translations[lang] = translations;
    }

    // this.translations[lang] = translations;

    this.updateLangs();
  }

  public addLangs(langs: Array<string>): void {
    langs.forEach((lang: string) => {
      if (this.langs.indexOf(lang) === -1) {
        this.langs.push(lang);
      }
    });
  }

  private updateLangs(): void {
    this.addLangs(Object.keys(this.translations));
  }

  public getTranslatedValue(key: string): Observable<string | unknown> {
    return of(this.getParsedResult(this.translations[this.currentLang], key));
  }

  public getParsedResult(translations: unknown, key: string): string {
    return this.getParsedTranslations(translations, key);
  }

  private getParsedTranslations(translations: unknown, key: string): string {
    let res!: string;

    if (translations) {
      res = this.translatorParser.interpolate(
        this.translatorParser.getValue(translations, key) as string,
      );
    }

    if (
      isUndefined(res) &&
      this.defaultLang !== null &&
      this.defaultLang !== this.currentLang &&
      this.useDefaultLang
    ) {
      res = this.translatorParser.interpolate(
        this.translatorParser.getValue(
          this.translations[this.defaultLang],
          key,
        ) as string,
      );
    }

    return !isUndefined(res) ? res : key;
  }

  private changeLang(lang: string): void {
    this.currentLang = lang;
  }

  public getBrowserLang(): string {
    if (isUndefined(this.window) || isUndefined(this.window.navigator)) {
      return 'undefined';
    }

    let browserLang: string = this.window.navigator.languages
      ? this.window.navigator.languages[0]
      : this.window.navigator.language;

    if (isUndefined(browserLang)) {
      return 'undefined';
    }

    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0];
    }

    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0];
    }

    return browserLang;
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}
