import { Component } from '@angular/core';
import {
  ColumnMode,
  IExportAll,
  IPageInfo,
  SelectionType,
} from '@vrsoftbr/vrc-datatables';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { Page } from '../shared/model/page';
import { ExportAllService } from '../shared/services/export-all.service';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-page-size',
  templateUrl: './datatable-page-size.component.html',
  styleUrls: ['./datatable-page-size.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatablePageSizeComponent {
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
    this.serverResultsService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });
  }

  onExportAll(data: IExportAll): void {
    this._exportAllService.generateFile(data).subscribe();
  }
}
