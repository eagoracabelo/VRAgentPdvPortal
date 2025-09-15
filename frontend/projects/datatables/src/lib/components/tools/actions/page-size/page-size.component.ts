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

@Component({
  selector: 'page-size',
  templateUrl: './page-size.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageSizeComponent implements OnDestroy {
  @HostBinding('class') hostClass = 'datatable-tools-page-size';

  @Output() pageSizeChange = new EventEmitter<number | string>();

  @Input() storageKeyPageSize!: string;

  @Input() pageSizeOptions!: number[];

  @Input() selectedPageSize!: number | string;

  private readonly _subs: Subscription[] = [];

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
