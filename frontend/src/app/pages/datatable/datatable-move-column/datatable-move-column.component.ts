import { Component } from '@angular/core';
import {
  ColumnMode,
  IExportAll,
  IPageInfo,
  SelectionType,
} from '@vrsoftbr/vrc-datatables';
import { BigData } from '../shared/model/big-data';
import { Page } from '../shared/model/page';
import { ExportAllService } from '../shared/services/export-all.service';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-move-column',
  templateUrl: './datatable-move-column.component.html',
  styleUrls: ['./datatable-move-column.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableMoveColumnComponent {
  page = new Page();
  rows = new Array<BigData>();

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
      .getResultsBig(this.page)
      .subscribe((pagedData) => {
        this.page = pagedData.page;
        this.rows = pagedData.data;
      });
  }

  onExportAll(data: IExportAll): void {
    this._exportAllService.generateFile(data).subscribe();
  }
}
