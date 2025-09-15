import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ColumnMode,
  IExportAll,
  IPageInfo,
  SelectionType,
} from '@vrsoftbr/vrc-datatables';
import { Observable, Subscription, fromEvent, of } from 'rxjs';
import { IDtEvents } from '../shared/interfaces/dt-events.interface';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { Page } from '../shared/model/page';
import { ExportAllService } from '../shared/services/export-all.service';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-select',
  templateUrl: './datatable-select.component.html',
  styleUrls: ['./datatable-select.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableSelectComponent implements OnInit, OnDestroy {
  page = new Page();
  rows = new Array<CorporateEmployee>();

  ColumnMode = ColumnMode;

  SelectionType = SelectionType;

  items$: Observable<unknown> = of([
    { value: 'AK', label: 'Alaska' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'CA', label: 'California' },
    { value: 'NV', label: 'Nevada' },
    { value: 'OR', label: 'Oregon' },
    { value: 'WA', label: 'Washington' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'CO', label: 'Colorado' },
    { value: 'ID', label: 'Idaho' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
  ]);

  private _subs = new Subscription();

  constructor(
    private serverResultsService: MockServerResultsService,
    private readonly _exportAllService: ExportAllService,
  ) {}

  ngOnInit(): void {
    this.listenToRemoveEvent();
    this.listenItemEvent();
  }

  setPage(pageInfo: IPageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.filter = pageInfo.filter;
    this.page.order = pageInfo.order;
    this.serverResultsService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onActivate(event: IDtEvents<CorporateEmployee>): void {
    /** empty */
  }

  onExportAll(data: IExportAll): void {
    this._exportAllService.generateFile(data).subscribe();
  }

  private listenItemEvent(): void {
    const sub = fromEvent(window, 'itemEvent').subscribe((event: unknown) => {
      const toggleEvent = event as {
        detail: { isItemEvent: boolean };
      };
      if (toggleEvent.detail.isItemEvent) {
        alert('FireEventButtons Item Event');
      }
    });
    this._subs.add(sub);
  }

  private listenToRemoveEvent(): void {
    const sub = fromEvent(window, 'datatablesRemoveEvent').subscribe(
      (event: unknown) => {
        const toggleEvent = event as {
          detail: { isRemoveEvent: boolean };
        };
        if (toggleEvent.detail.isRemoveEvent) {
          alert('FireEventButtons Remove');
        }
      },
    );
    this._subs.add(sub);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
