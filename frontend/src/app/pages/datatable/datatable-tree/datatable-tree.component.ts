import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Select2Data, Select2UpdateEvent } from '@vrsoftbr/vr-components';

import { ColumnMode, SelectionType } from '@vrsoftbr/vrc-datatables';
import { IFiltered } from '../shared/interfaces/filtered.interface';

export interface IOrder {
  column: string;
  dir: 'ASC' | 'DESC';
}

export interface IPage {
  count?: number;
  order?: IOrder;
  filter: IFiltered;
  limit: number;
  offset: number;
  pageSize: number;
}

interface IItem {
  idProduto: number;
  codigoBarras: string;
  descricaoCompleta: string;
  precoVendaUnitario: string;
  cancelado: boolean;
  deconto: string;
  acrescimo: string;
  totalBruto: string;
  totalLiquido: string;
}

interface IPdvVenda {
  id: number;
  numeroCupom: number;
  dataHora: string;
  numeroPdv: number;
  valorBruto: string;
  valorDesconto: string;
  valorAcrescimo: string;
  valorLiquido: string;
  cancelado: boolean;
  itens: IItem[];
  treeStatus?: string;
}

export interface IExtratoVendasTotal {
  numeroCupom?: number;
  valorLiquido: number;
  valorDesconto: number;
  valorAcrescimo: number;
  valorBruto: number;
  cancelado?: number;
  numeroPdv?: number;
}

interface IDataTablesSelected<T> {
  selected: T[];
}

@Component({
  selector: 'vr-datatable-tree',
  templateUrl: './datatable-tree.component.html',
  styleUrls: ['./datatable-tree.component.scss'],
})
export class DatatableTreeComponent {
  rows: IPdvVenda[] = [];
  lastIndex = 15;

  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected: IPdvVenda[] = [];
  itemsToSelect: IPdvVenda[] = [];
  totalElements = 0;

  summaryGroupRows = new Array<object>();

  configOfColumnsRowsTotalGroup = [
    { control: 'valorBruto', width: 20 },
    { control: 'valorAcrescimo', width: 20 },
    { control: 'valorDesconto', width: 20 },
    { control: 'valorLiquido', width: 20 },
  ];

  defaultTotal: IExtratoVendasTotal = {
    valorBruto: 0,
    valorAcrescimo: 0,
    valorDesconto: 0,
    valorLiquido: 0,
  };

  extratoVendaTotalGeral: IExtratoVendasTotal = {
    ...this.defaultTotal,
  };

  extratoVendaTotal: IExtratoVendasTotal[] = [];

  tempPage: IPage = {
    filter: {},
    order: {
      column: 'id',
      dir: 'ASC',
    },
    offset: 0,
    limit: 0,
    pageSize: 10,
  };

  treeStatus?: string;

  itens: IItem[] = [
    {
      idProduto: 1,
      codigoBarras: '7891910000197',
      descricaoCompleta: 'Coca-Col 2L',
      precoVendaUnitario: '9.4',
      cancelado: false,
      deconto: '0.4',
      acrescimo: '1.2',
      totalBruto: '9.4',
      totalLiquido: '9.4',
    },
    {
      idProduto: 2,
      codigoBarras: '7891910000197',
      descricaoCompleta: 'Coca-Cola 2L',
      precoVendaUnitario: '9.49',
      cancelado: false,
      deconto: '0.49',
      acrescimo: '1.29',
      totalBruto: '9.49',
      totalLiquido: '9.49',
    },
  ];

  tipoExibicaoValue = '1';

  tipoExibicao: Select2Data = [
    {
      label: 'Tipo exibição',
      options: [
        {
          value: '1',
          label: 'Sintético',
        },
        {
          value: '2',
          label: 'Analítico',
        },
      ],
    },
  ];

  constructor(private cd: ChangeDetectorRef) {
    this.fetch((data) => {
      // data = data.slice(1, this.lastIndex);
      this.rows = data.map((d) => {
        d.treeStatus = 'collapsed';
        return d;
      });

      this.selected = this.itemsToSelect;
      // this.totalElements = response.count;
      this.totalElements = 10;
      this.resetOffset();
      if (this.rows.length > 0) {
        this.summaryTotalGeral();
        this.summaryTotal();
      }
    });
  }

  fetch(cb: (data: IPdvVenda[]) => void): void {
    const req = new XMLHttpRequest();
    req.open('GET', `datatables/data/pdv-venda.json`);

    req.onload = (): void => {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        cb(JSON.parse(req.response) as IPdvVenda[]);
      }, 500);
    };

    req.send();
  }

  setPage(page: IPage): void {
    console.log('page', page);
  }

  onSelect(item: IDataTablesSelected<IPdvVenda>): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...item.selected);
    // this.itemsSelected.next(this.selected.length);
  }

  @ViewChild('tableExtratoMovimentacao') table!: {
    groupHeader: {
      toggleExpandGroup: (group: unknown) => void;
    };
  };

  toggleExpandGroup(group: unknown): void {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  summaryTotalGeral(): void {
    this.extratoVendaTotalGeral = { ...this.defaultTotal };
    const keys = Object.keys(this.extratoVendaTotalGeral);

    for (const row of this.rows) {
      for (const key of keys) {
        const emgt = this.extratoVendaTotalGeral as unknown as {
          [key: string]: number;
        };
        const rowObject = row as unknown as {
          [key: string]: string | number;
        };
        emgt[key] += Number(rowObject[key]);
      }
    }
  }

  summaryTotal(): void {
    this.extratoVendaTotal = [];
    const keys = Object.keys(this.extratoVendaTotalGeral);
    const grupo = this.rows.map((r) => r.numeroPdv);
    const numerosPdv = [...new Set(grupo)];

    for (const numeroPdv of numerosPdv) {
      const temporary = {
        ...(this.defaultTotal as unknown as {
          [key: string]: number;
        }),
      };

      const rowsOfLocalDeEstoque = this.rows.filter(
        (row) => row.numeroPdv === numeroPdv,
      );

      for (const row of rowsOfLocalDeEstoque) {
        for (const key of keys) {
          const rowObject = row as unknown as {
            [key: string]: string | number;
          };

          temporary[key] += Number(rowObject[key]);
        }
      }

      this.extratoVendaTotal.push({
        ...(temporary as unknown as IExtratoVendasTotal),
        numeroPdv: numeroPdv,
      });
    }
  }

  getSummaryTotalByGroup(numeroPdv: number): IExtratoVendasTotal {
    return (
      this.extratoVendaTotal.find(
        (element) => element.numeroPdv === +numeroPdv,
      ) || this.defaultTotal
    );
  }

  protected resetOffset(): void {
    if (this.rows.length === 0 && this.tempPage.offset > 0) {
      this.tempPage.offset--;
      this.setPage(this.tempPage);
    }
  }

  onTreeAction(row: IPdvVenda): void {
    if (!row.treeStatus) return;

    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'loading';

      setTimeout(() => {
        row.treeStatus = 'expanded';
        this.rows = this.rows.map((r) => {
          if (r.id !== row.id) {
            r.treeStatus = 'collapsed';
          }
          return r;
        });
        if (row.itens.length <= 0) {
          row.itens = [...this.itens];
        }
      }, 500);
    } else {
      row.treeStatus = 'collapsed';
      this.rows = [...this.rows];
    }

    this.cd.detectChanges();
  }

  update(event: Select2UpdateEvent<string>): void {
    this.tipoExibicaoValue = event.value;

    if (event.value === '1') {
      this.rows = this.rows.map((r) => {
        r.treeStatus = 'collapsed';
        return r;
      });
    }
  }
}
