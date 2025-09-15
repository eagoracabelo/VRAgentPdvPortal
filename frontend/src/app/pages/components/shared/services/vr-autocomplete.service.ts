import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Estado } from '../models/estado';

@Injectable({
  providedIn: 'root',
})
export class VrAutocompleteService {
  constructor(private http: HttpClient) {}

  getEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>('mock/estados.json').pipe(take(1));
  }
}
