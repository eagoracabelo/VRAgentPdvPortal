import { Component, OnDestroy, OnInit, signal } from '@angular/core';
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
  selector: 'vr-datatable-checkbox',
  templateUrl: './datatable-checkbox.component.html',
  styleUrls: ['./datatable-checkbox.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableCheckboxComponent implements OnInit, OnDestroy {
  page = new Page();
  rows = new Array<CorporateEmployee>();

  ColumnMode = ColumnMode;

  selected: unknown[] = [];

  SelectionType = SelectionType;

  fireEventButtons: IFireEventButton[] = [
    {
      label: 'Excluir',
      icon: 'lixo',
      event: new CustomEvent('datatablesRemoveEvent', {
        detail: {
          isRemoveEvent: true,
        },
      }),
      disabled: true,
    },
    {
      label: 'Dropdown',
      icon: 'cartao-credito',
      dropdown: [
        {
          label: 'Item com Evento',
          event: new CustomEvent('itemEvent', {
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

  private _subs = new Subscription();

  currencyTypes = [
    { label: 'Real', value: 'BRL' },
    { label: 'Dolar', value: 'USD' },
    { label: 'Euro', value: 'EUR' },
    { label: 'Guarany', value: 'PYG' },
  ];

  currencySelected = signal<string>('BRL');
  currencyTotable = signal<string>('BRL');

  constructor(
    private serverResultsService: MockServerResultsService,
    private readonly _exportAllService: ExportAllService,
  ) {}

  ngOnInit(): void {
    this.listenToRemoveEvent();
    this.listenItemEvent();
  }

  setPage(pageInfo: IPageInfo): void {
    this.resetSelecteds();
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.filter = pageInfo.filter;
    this.page.order = pageInfo.order;
    this.serverResultsService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
      this.errorRows.push(this.rows[2]);
      this.errorRows.push(this.rows[4]);
      this.errorRows.push(this.rows[5]);
    });
  }

  resetSelecteds(): void {
    if (this.selected.length > 0) {
      this.selected = [];
    }
  }

  onSelect({ selected }: { selected: unknown[] }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onActivate(event: IDtEvents<CorporateEmployee>): void {
    /** empty */
  }

  displayCheck(row: { name: string }): boolean {
    return row.name !== 'Ethel Price';
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

  updateSelected(event: { options: [{ label: string; value: string }] }): void {
    const opt = event.options[0];
    if (opt) {
      this.currencyTotable.set(opt.value);
    }
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
