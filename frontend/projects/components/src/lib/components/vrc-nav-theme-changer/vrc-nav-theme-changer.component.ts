import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { VrcThemeService } from '../../services/vrc-theme.service';

@Component({
  selector: 'vrc-nav-theme-changer',
  templateUrl: './vrc-nav-theme-changer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavThemeChangerComponent implements OnInit {
  model = { theme: 'light' };

  constructor(private readonly themeService: VrcThemeService) {}

  get isLightTheme(): boolean {
    return this.model.theme === 'light';
  }

  ngOnInit(): void {
    this.checkTheme();
  }

  private checkTheme(): void {
    this.themeService.theme.subscribe((value: string) => {
      if (this.model.theme !== value) {
        this.model.theme = value;
      }
    });
  }

  setTheme(): void {
    if (this.model.theme === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }
}
