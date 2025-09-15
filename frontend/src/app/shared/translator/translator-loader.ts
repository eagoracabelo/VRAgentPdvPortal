import { Observable } from 'rxjs';

export abstract class TranslatorLoader {
  abstract getTranslations(lang: string): Observable<unknown>;
}
