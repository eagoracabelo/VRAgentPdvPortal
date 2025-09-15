import {
  ChangeDetectorRef,
  EventEmitter,
  Injectable,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ISelectMapped } from '../interfaces/iselect-mapped';
import { Translator } from '../interfaces/translator';

import { TranslatorService } from '../services/translator.service';

@Injectable()
@Pipe({
  name: 'translator',
  pure: true,
})
export class TranslatorPipe implements PipeTransform, OnDestroy {
  value = '';
  lastKey!: string;
  lastValue!: string;
  lastParams!: unknown[];

  private _sub!: Subscription;

  get translatorChange(): EventEmitter<Translator> {
    return this.translate.onTranslatorChange;
  }

  constructor(
    private translate: TranslatorService,
    private _ref: ChangeDetectorRef,
  ) {}

  transformLabels(items: ISelectMapped[]): ISelectMapped[] {
    return items.map((item) => ({
      ...item,
      label: this.transform(item.label),
    }));
  }

  transform(key: string, category = 'FRONTEND'): string {
    this.lastValue = key;
    this.lastKey = `${category}.${key}`;
    this.updateValue(this.lastKey);
    return this.value;
  }

  updateValue(key: string): void {
    this._sub = this.translate
      .getTranslatedValue(key)
      .pipe(take(1))
      .subscribe((v: unknown) => {
        this.setValuesAndMark(v as string, key);
      });
  }

  setValuesAndMark(res: string, key: string): void {
    this.value = !isEmpty(res) ? res : this.lastValue;
    this.lastKey = key;
    this._ref.markForCheck();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }
}
