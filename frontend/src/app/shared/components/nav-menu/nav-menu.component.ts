import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReloadService } from '../../services/reload.service';
import { TranslatorService } from '../../services/translator.service';

interface ISelect {
  value: number | string;
  label: string;
}

@Component({
  selector: 'vr-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['nav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavMenuComponent implements OnInit {
  availableLanguages: ISelect[] = [];
  formGroup!: FormGroup;

  constructor(
    private translatorService: TranslatorService,
    private readonly _reloadService: ReloadService,
  ) {}

  get currentLang(): string {
    return (
      this.translatorService.currentLang ||
      this.translatorService.getLocalLang() ||
      'pt-BR'
    );
  }

  ngOnInit(): void {
    this.buildForm();

    const langs: string[] = this.translatorService.langs;

    langs.forEach((lang: string) => {
      this.availableLanguages.push({ value: lang, label: lang });
    });
  }

  private buildForm(): void {
    this.formGroup = new FormGroup({
      language: new FormControl(this.currentLang),
    });
  }

  changeLanguage(e: { value: string }): void {
    if (e.value === this.currentLang) return;

    this.defaultLanguage = e.value;
    setTimeout(() => this._reloadService.reload(), 10);
  }

  set defaultLanguage(lang: string) {
    this.translatorService.use(lang);
  }

  get defaultLanguage(): string {
    return this.translatorService.currentLang;
  }
}
