import { Component, OnDestroy } from '@angular/core';
import {
  ColumnMode,
  IExportAll,
  IPageInfo,
  SelectionType,
} from '@vrsoftbr/vrc-datatables';
import { Subscription, take } from 'rxjs';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { Page } from '../shared/model/page';
import { ExportAllService } from '../shared/services/export-all.service';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-translation',
  templateUrl: './datatable-translation.component.html',
  styleUrls: ['./datatable-translation.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableTranslationComponent implements OnDestroy {
  protected _subs: Subscription[] = [];

  page = new Page();
  rows = new Array<CorporateEmployee>();
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private serverResultsService: MockServerResultsService,
    private readonly _exportAllService: ExportAllService,
  ) {}

  setPage(pageInfo: IPageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.filter = pageInfo.filter;
    this.page.order = pageInfo.order;
    this.serverResultsService
      .getResults(this.page)
      .pipe(take(1))
      .subscribe((pagedData) => {
        this.page = pagedData.page;
        this.rows = pagedData.data;
      });
  }

  onExportAll(data: IExportAll): void {
    this._exportAllService.generateFile(data).subscribe();
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
