import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarConfigService {
  apiKey!: string;
  calendarId!: string;
}
