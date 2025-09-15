import { Injectable } from '@angular/core';
import packageInfo from '../../../../package.json';

@Injectable({
  providedIn: 'root',
})
export class VersaoService {
  getVersion(): string {
    return packageInfo.version;
  }
}
