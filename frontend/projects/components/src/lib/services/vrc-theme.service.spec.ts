import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';

import { VrcThemeService } from './vrc-theme.service';

describe('VrcThemeService', () => {
  let service: VrcThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.inject(VrcThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    const event = new CustomEvent('changetheme', { detail: { theme: 'dark' } });
    document.dispatchEvent(event);
  });

  it('themeApplied', () => {
    expect(service.themeApplied).toEqual('light');
  });

  describe('setTheme', () => {
    it('should set dark theme', () => {
      service.loadTheme();
      service.setTheme('dark');
      service.theme.pipe(take(1)).subscribe((value: string) => {
        expect(value).toEqual('dark');
      });
      expect(service.themeApplied).toEqual('dark');
    });

    it('should set light theme', () => {
      service.loadTheme();
      service.setTheme('light');
      service.theme.pipe(take(1)).subscribe((value: string) => {
        expect(value).toEqual('light');
      });
      expect(service.themeApplied).toEqual('light');
    });
  });

  it('loadTheme', () => {
    service.loadTheme();
    service.setTheme('light');
    service.theme.pipe(take(1)).subscribe((value: string) => {
      expect(value).toEqual('light');
    });
    expect(service.themeApplied).toEqual('light');
  });
});
