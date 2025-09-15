import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TranslationService } from '../../services/translation.service';
import { TableFooterDirective } from './directives/footer.directive';

@Component({
  selector: 'table-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFooterComponent implements OnInit, OnDestroy {
  @Input() footerHeight!: number;
  @Input() totalMessage!: string;
  @Input() footerTemplate!: TableFooterDirective;

  @Input() selectedCount = 0;
  @Input() selectedMessage!: string | boolean;

  @HostBinding('class') hostClasses = 'table-footer';

  private readonly _subs: Subscription[] = [];

  constructor(
    private readonly _translationService: TranslationService,
    private readonly _cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const sub = this._translationService.loadedTranslations$.subscribe(() =>
      this._cd.detectChanges(),
    );
    this._subs.push(sub);
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
