import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslatorLoader } from './translator-loader';

export class TranslatorHttpLoader implements TranslatorLoader {
  constructor(
    private http: HttpClient,
    public prefix: string = 'translations-i18n',
    public suffix: string = '.json',
  ) {}

  public getTranslations(lang: string): Observable<unknown> {
    return this.http.get(`${this.prefix}/${lang}${this.suffix}`);
  }
}
