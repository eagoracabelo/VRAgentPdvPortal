import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IFiltered } from './../../interfaces/filtered.interface';
import { ISort } from './../../interfaces/sort.interface';
import { DatatableFooterDirective } from './directives/footer.directive';

@Component({
  selector: 'datatable-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFooterComponent implements OnDestroy {
  @Input() footerHeight!: number;
  @Input() rowCount!: number;
  @Input() pageSize!: number;
  @Input() offset!: number;
  @Input() filter!: IFiltered;
  @Input() pagerLeftArrowIcon!: string;
  @Input() pagerRightArrowIcon!: string;
  @Input() pagerPreviousIcon!: string;
  @Input() pagerNextIcon!: string;
  @Input() itemsMessage!: string;
  @Input() itemsPerPageMessage!: string;
  @Input() footerTemplate!: DatatableFooterDirective;
  @Input() sorts!: ISort;

  @Input() selectedCount = 0;
  @Input() ofMessage!: string | boolean;

  @Output() page: EventEmitter<unknown> = new EventEmitter();

  @HostBinding('class') hostClasses = 'datatable-footer';

  @Output() pageSizeChange = new EventEmitter<number | string>();

  @Input() storageKeyPageSize!: string;

  @Input() pageSizeOptions!: number[];

  @Input() selectedPageSize!: number;

  private readonly _subs: Subscription[] = [];

  get isVisible(): boolean {
    return this.rowCount / this.pageSize > 1;
  }

  get curPage(): number {
    return this.offset + 1;
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
