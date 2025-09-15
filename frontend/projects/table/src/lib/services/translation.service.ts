import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import translationDataEnUS from '../assets/translations-i18n/en-US_dt.json';
import translationDataEs from '../assets/translations-i18n/es_dt.json';
import translationDataPtBR from '../assets/translations-i18n/pt-BR_dt.json';

interface ITranslationData {
  language: string;
  translation: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  loadedTranslations$: BehaviorSubject<{ [key: string]: string }> =
    new BehaviorSubject(
      translationDataPtBR as unknown as { [key: string]: string },
    );

  private _loadedTranslations: { [key: string]: string } =
    translationDataPtBR as unknown as { [key: string]: string };

  private _translationEnUS: ITranslationData = {
    language: 'en-US',
    translation: translationDataEnUS,
  };

  private _translationEs: ITranslationData = {
    language: 'es-ES',
    translation: translationDataEs,
  };

  private _translationPtBR: ITranslationData = {
    language: 'pt-BR',
    translation: translationDataPtBR,
  };

  private _languages: ITranslationData[] = [
    this._translationPtBR,
    this._translationEnUS,
    this._translationEs,
  ];

  private _currentLanguage = this._translationPtBR;

  constructor() {
    /** empty */
  }

  loadTranslation(lang: string): Observable<boolean> {
    this._currentLanguage =
      this._languages.find((l) => l.language === lang) ?? this._translationPtBR;

    return new Observable((observer) => {
      this._getTranslation(this._currentLanguage).subscribe((translation) => {
        const loaded = translation as { [key: string]: string };
        this._loadedTranslations = loaded;
        setTimeout(() => {
          this.loadedTranslations$.next(loaded);
        }, 50);
        observer.next(true);
      });
    });
  }

  private _getTranslation(
    translationData: ITranslationData,
  ): Observable<unknown> {
    return of(translationData.translation);
  }

  getValue(key: string, target = this._loadedTranslations): never {
    const separator = '.';
    const keys = key.split(separator);
    const newKey = keys.shift();
    if (newKey) {
      target = this.getValue(keys.join(separator), target[newKey] as never);
    }

    return target as never;
  }
}
