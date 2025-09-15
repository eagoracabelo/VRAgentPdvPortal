import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, take } from 'rxjs';

export type ThemeOptions = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class VrcThemeService {
  private readonly _themeActive = new BehaviorSubject<ThemeOptions>('light');
  private readonly _storageTheme = 'vr_theme';

  constructor() {
    this.onLoadWindow();
    this.onChangeTheme();
  }

  get theme(): Observable<string> {
    return this._themeActive.asObservable();
  }

  get themeApplied(): string {
    return this._themeActive.value;
  }

  private get isDarkTheme(): boolean {
    const key = this._storageTheme;
    const itemLocalStorage = localStorage.getItem(key);
    return itemLocalStorage === 'dark';
  }

  setTheme(name: ThemeOptions): void {
    if (name === 'dark') {
      if (document.documentElement.hasAttribute('theme')) {
        document.documentElement.removeAttribute('theme');
      }
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }

    localStorage.setItem(this._storageTheme, name);
    this._themeActive.next(name);
  }

  private onLoadWindow(): void {
    fromEvent(window, 'load')
      .pipe(take(1))
      .subscribe(() => {
        this.loadTheme();
      });
  }

  public loadTheme(): void {
    if (this.isDarkTheme) {
      document.documentElement.removeAttribute('theme');
      this._themeActive.next('dark');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
  }

  private onChangeTheme(): void {
    fromEvent(document, 'changetheme').subscribe((event) => {
      const changeThemeEvent = event as Event & {
        detail: { theme: ThemeOptions };
      };
      const { theme } = changeThemeEvent.detail;
      this._themeActive.next(theme);
    });
  }
}
