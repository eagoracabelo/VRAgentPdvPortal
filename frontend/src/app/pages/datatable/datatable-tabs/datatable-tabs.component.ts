import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ColumnMode,
  IExportAll,
  IFireEventButton,
  IPageInfo,
  SelectionType,
} from '@vrsoftbr/vrc-datatables';
import { fromEvent, Subscription } from 'rxjs';
import { IDtEvents } from '../shared/interfaces/dt-events.interface';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { Page } from '../shared/model/page';
import { ExportAllService } from '../shared/services/export-all.service';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-tabs',
  templateUrl: './datatable-tabs.component.html',
  styleUrls: ['./datatable-tabs.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableTabsComponent implements OnInit, OnDestroy {
  pageTab1 = new Page();
  rowsTab1 = new Array<CorporateEmployee>();

  pageTab2 = new Page();
  rowsTab2 = new Array<unknown>();

  pageTab3 = new Page();
  rowsTab3 = new Array<CorporateEmployee>();

  ColumnMode = ColumnMode;

  SelectionType = SelectionType;

  private _subs = new Subscription();

  forceCalculateColumns: unknown = null;
  tabAcitve = 0;

  customMask = {
    mask: '000.0.0.0:0000',
    autofix: true,
    lazy: true,
    overwrite: true,
  };

  fireEventButtonsTab2: IFireEventButton[] = [
    {
      label: 'Pesquisa',
      icon: 'pesquisa',
      event: new CustomEvent('datatablesPesquisaEventTab2', {
        detail: {
          isPesquisaEvent: true,
        },
      }),
    },
  ];

  fireEventButtonsTab3: IFireEventButton[] = [
    {
      label: 'Excluir',
      icon: 'lixo',
      event: new CustomEvent('datatablesRemoveEventTab3', {
        detail: {
          isRemoveEvent: true,
        },
      }),
    },
    {
      label: 'Dropdown',
      icon: 'cartao-credito',
      dropdown: [
        {
          label: 'Item com Evento',
          event: new CustomEvent('itemEventTab3', {
            detail: {
              isItemEvent: true,
            },
          }),
        },
        {
          label: 'Item',
        },
      ],
    },
  ];

  errorRows: unknown[] = [];

  selectedTab3: unknown[] = [];

  constructor(
    private serverResultsService: MockServerResultsService,
    private readonly _exportAllService: ExportAllService,
  ) {}

  ngOnInit(): void {
    this.listenToRemoveEvent();
    this.listenItemEvent();
    this.listenToPesquisarEventTab2();
    this.listenItemEventTab3();
    this.listenToRemoveEventTab3();
  }

  setPageTab1(pageInfo: IPageInfo): void {
    this.pageTab1.pageNumber = pageInfo.offset;
    this.pageTab1.size = pageInfo.pageSize;
    this.pageTab1.filter = pageInfo.filter;
    this.pageTab1.order = pageInfo.order;
    this.serverResultsService
      .getResults(this.pageTab1)
      .subscribe((pagedData) => {
        this.pageTab1 = pagedData.page;
        this.rowsTab1 = pagedData.data;
      });
  }

  onActivateTab1(_: IDtEvents<CorporateEmployee>): void {
    /** empty */
  }

  onExportAllTab1(data: IExportAll): void {
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

  setPageTab2(pageInfo: IPageInfo): void {
    this.pageTab2.pageNumber = pageInfo.offset;
    this.pageTab2.size = pageInfo.pageSize;
    this.serverResultsService
      .getResultsDataTypes(this.pageTab2)
      .subscribe((pagedData) => {
        this.pageTab2 = pagedData.page;
        this.rowsTab2 = pagedData.data;
      });
  }

  onExportAllTab2(data: IExportAll): void {
    this._exportAllService.generateFileDataTypes(data).subscribe();
  }

  private listenToPesquisarEventTab2(): void {
    const sub = fromEvent(window, 'datatablesPesquisaEventTab2').subscribe(
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

  setPageTab3(pageInfo: IPageInfo): void {
    this.resetSelectedsTab3();
    this.pageTab3.pageNumber = pageInfo.offset;
    this.pageTab3.size = pageInfo.pageSize;
    this.pageTab3.filter = pageInfo.filter;
    this.pageTab3.order = pageInfo.order;
    this.serverResultsService
      .getResults(this.pageTab3)
      .subscribe((pagedData) => {
        this.pageTab3 = pagedData.page;
        this.rowsTab3 = pagedData.data;
        this.errorRows.push(this.rowsTab3[2]);
        this.errorRows.push(this.rowsTab3[4]);
        this.errorRows.push(this.rowsTab3[5]);
      });
  }

  resetSelectedsTab3(): void {
    if (this.selectedTab3.length > 0) {
      this.selectedTab3 = [];
    }
  }

  onSelectTab3({ selected }: { selected: unknown[] }): void {
    this.selectedTab3.splice(0, this.selectedTab3.length);
    this.selectedTab3.push(...selected);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onActivateTab3(event: IDtEvents<CorporateEmployee>): void {
    /** empty */
  }

  displayCheckTab3(row: { name: string }): boolean {
    return row.name !== 'Ethel Price';
  }

  onExportAllTab3(data: IExportAll): void {
    this._exportAllService.generateFile(data).subscribe();
  }

  private listenItemEventTab3(): void {
    const sub = fromEvent(window, 'itemEventTab3').subscribe(
      (event: unknown) => {
        const toggleEvent = event as {
          detail: { isItemEvent: boolean };
        };
        if (toggleEvent.detail.isItemEvent) {
          alert('FireEventButtons Item Event');
        }
      },
    );
    this._subs.add(sub);
  }

  private listenToRemoveEventTab3(): void {
    const sub = fromEvent(window, 'datatablesRemoveEventTab3').subscribe(
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

  onSelectedTab(active: number): void {
    console.log('onSelectedTab', active);

    if (this.tabAcitve !== active) {
      this.tabAcitve = active;
      this.forceCalculateColumns = (Math.random() + 1)
        .toString(36)
        .substring(7);
    }
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
