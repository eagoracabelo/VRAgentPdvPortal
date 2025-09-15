import { Component } from '@angular/core';
import { ColumnMode, IPageInfo, SelectionType } from '@vrsoftbr/vrc-datatables';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { Page } from '../shared/model/page';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-column-group',
  templateUrl: './datatable-column-group.component.html',
  styleUrls: ['./datatable-column-group.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableColumnGroupComponent {
  page = new Page();
  rows = new Array<CorporateEmployee>();

  ColumnMode = ColumnMode;

  SelectionType = SelectionType;

  constructor(private serverResultsService: MockServerResultsService) {}

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
}
