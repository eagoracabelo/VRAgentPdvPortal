import { Component, ViewChild } from '@angular/core';
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
  selector: 'vr-datatable-basico',
  templateUrl: './datatable-basico.component.html',
  styleUrls: ['./datatable-basico.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableBasicoComponent {
  page = new Page();
  rows = new Array<CorporateEmployee>();

  @ViewChild('myTable') table!: {
    groupHeader: {
      toggleExpandGroup: (group: unknown) => void;
    };
  };

  ColumnMode = ColumnMode;

  SelectionType = SelectionType;

  clickableRows = true;

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

  displayCheck(row: { name: string }): boolean {
    return row.name !== 'Ethel Price';
  }

  onExportAll(data: IExportAll): void {
    this._exportAllService.generateFile(data).subscribe();
  }
}
