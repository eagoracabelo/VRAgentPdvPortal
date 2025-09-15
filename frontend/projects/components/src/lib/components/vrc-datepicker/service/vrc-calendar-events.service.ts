import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VrcCalendarEventsService {
  private _url = '';
  constructor(private readonly http: HttpClient) {
    /* empty */
  }

  public get url(): string {
    if (!this._url || this._url === '') {
      console.error(
        'VR DATEPICKER: URL para obter dias não úteis não foi informada!',
      );
      return '';
    }
    return this._url;
  }
  public set url(v: string) {
    this._url = v;
  }

  getNonWorkingDays(
    year: number | string,
  ): Observable<{ date: string; name: string }[]> {
    const params = new HttpParams().set('ano', year.toString());
    const queryParams: {
      params: HttpParams | undefined;
      observe: 'body';
    } = { params, observe: 'body' };
    const url = this.url;
    return url
      ? this.http
          .get<{ date: string; name: string }[]>(this.url, queryParams)
          .pipe(take(1))
      : new Observable<{ date: string; name: string }[]>().pipe(take(1));
  }
}
