import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';

import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  pure: true,
})
export class TranslatePipe implements PipeTransform {
  constructor(
    private readonly _translationService: TranslationService,
    private readonly _cd: ChangeDetectorRef,
  ) {}

  transform(key: string): unknown {
    this._cd.markForCheck();
    return this._translationService.getValue(key);
  }
}
