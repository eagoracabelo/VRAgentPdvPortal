import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  ColumnMode,
  IExportAll,
  IFireEventButton,
  IPageInfo,
  SelectionType,
} from '@vrsoftbr/vrc-datatables';

import { Subscription, fromEvent } from 'rxjs';
import { Page } from '../shared/model/page';
import { ExportAllService } from '../shared/services/export-all.service';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-data-type',
  templateUrl: './datatable-data-type.component.html',
  styleUrls: ['./datatable-data-type.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableDataTypeComponent implements OnInit, OnDestroy {
  page = new Page();
  rows = new Array<unknown>();

  ColumnMode = ColumnMode;

  SelectionType = SelectionType;

  preSelectedColumns = ['id', undefined, 'cep', 'cpf'];

  customMask = {
    mask: '000.0.0.0:0000',
    autofix: true,
    lazy: true,
    overwrite: true,
  };

  fireEventButtons: IFireEventButton[] = [
    {
      label: 'Pesquisa',
      icon: 'pesquisa',
      event: new CustomEvent('datatablesPesquisaEvent', {
        detail: {
          isPesquisaEvent: true,
        },
      }),
    },
  ];

  private _subs = new Subscription();

  constructor(
    private serverResultsService: MockServerResultsService,
    private readonly _exportAllService: ExportAllService,
  ) {}

  ngOnInit(): void {
    this.listenToPesquisarEvent();
  }

  setPage(pageInfo: IPageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.serverResultsService
      .getResultsDataTypes(this.page)
      .subscribe((pagedData) => {
        this.page = pagedData.page;
        this.rows = pagedData.data;
      });
  }

  onExportAll(data: IExportAll): void {
    this._exportAllService.generateFileDataTypes(data).subscribe();
  }

  private listenToPesquisarEvent(): void {
    const sub = fromEvent(window, 'datatablesPesquisaEvent').subscribe(
      (event: unknown) => {
        const toggleEvent = event as {
          detail: { isPesquisaEvent: boolean };
        };
        if (toggleEvent.detail.isPesquisaEvent) {
          alert('FireEventButtons Pesquisa');
        }
      },
    );
    this._subs.add(sub);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
