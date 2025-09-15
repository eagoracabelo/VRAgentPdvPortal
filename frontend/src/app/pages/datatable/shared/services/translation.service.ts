import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private _langs: string[] = ['en-US', 'pt-BR', 'es-ES'];
  private _loadedTranslations!: { [key: string]: string };

  get langs(): string[] {
    return this._langs;
  }

  constructor(private _http: HttpClient) {}

  loadTranslation(lang: string): Observable<boolean> {
    return new Observable((observer) => {
      this._getTranslation(lang).subscribe((translation) => {
        this._loadedTranslations = translation as { [key: string]: string };
        observer.next(true);
      });
    });
  }

  private _getTranslation(lang: string): Observable<unknown> {
    return this._http.get(`/assets/translations-i18n/${lang}.json`);
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
