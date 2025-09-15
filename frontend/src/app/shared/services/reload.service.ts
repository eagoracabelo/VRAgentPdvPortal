import { Inject, Injectable, Optional } from '@angular/core';
import { LOCATION_TOKEN } from '../constants/location';

@Injectable({
  providedIn: 'root',
})
export class ReloadService {
  constructor(@Optional() @Inject(LOCATION_TOKEN) private location: Location) {}

  reload(): void {
    this.location.reload();
  }
}
