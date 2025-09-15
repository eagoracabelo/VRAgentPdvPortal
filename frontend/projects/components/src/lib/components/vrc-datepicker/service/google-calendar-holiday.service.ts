import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { withCache } from '@ngneat/cashew';
import { catchError, map, Observable, of, take } from 'rxjs';

import { Holiday } from './../models/holiday';
import { GoogleCalendarConfigService } from './google-calendar-config.service';

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarHolidayService {
  private readonly baseUrl!: string;

  constructor(
    private readonly http: HttpClient,
    private readonly _config: GoogleCalendarConfigService,
  ) {
    this.baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${this._config.calendarId}/events`;
  }

  getHolidayBetweenDates(
    startDate: string,
    endDate: string,
  ): Observable<Holiday[]> {
    if (!this._config.calendarId || !this._config.apiKey) {
      return of([]);
    }

    const timeMin = `${startDate}T00:00:00Z`;
    const timeMax = `${endDate}T23:59:59Z`;
    const query = `key=${this._config.apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=100`;
    const url = this.getUrl(query);
    return this.http
      .get<{ items: Holiday[] }>(url, {
        context: withCache({ ttl: 2629800000 }),
      })
      .pipe(
        take(1),
        map((kind) => kind?.items),
        catchError((error) => {
          console.error('Google Calendar Error getting holidays: ', error);
          return of([]);
        }),
      );
  }

  getHolidaysYear(year: string | number): Observable<Holiday[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    return this.getHolidayBetweenDates(startDate, endDate);
  }

  getHolidayName(date: string): Observable<string> {
    return this.getHolidayBetweenDates(date, date).pipe(
      take(1),
      map((holidays) => holidays[0]?.summary ?? ''),
    );
  }

  isHoliday(date: string): Observable<boolean> {
    return this.getHolidayName(date).pipe(
      map((holidayName) => holidayName !== ''),
    );
  }

  private getUrl(query: string): string {
    return `${this.baseUrl}?${query}`;
  }
}
