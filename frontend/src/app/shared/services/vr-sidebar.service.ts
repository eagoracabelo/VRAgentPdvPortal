import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, take } from 'rxjs';
import { JSONObject } from '../interfaces/json.interface';

@Injectable({
  providedIn: 'root',
})
export class VrSidebarService {
  constructor(private http: HttpClient) {}

  getSidebarAppMenu(): Observable<JSONObject> {
    return this.http.get<JSONObject>('sidebar-menu-app.json').pipe(take(1));
  }
}
