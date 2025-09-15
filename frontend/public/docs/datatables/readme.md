<p  align="center">

<h1  align="center">VR Datatables</h1>

</p>

[![Angular](https://img.shields.io/badge/angular-v18-red.svg)]([https://github.com/angular/angular-cli)
[![TypeScript](https://img.shields.io/badge/100%25-TypeScript-blue.svg)](https://www.typescriptlang.org)

**vr datatables é uma biblioteca [Angular](https://angular.io) (>=18) com componentes reutilizáveis.**

---

## Pré Requisitos

No AppModule principal adicionar o pipe de tradução:

```typescript
{ provide: 'TRANSLATOR_TOKEN', useClass: TranslatorPipe }
```

Adicionar ao JSON de tradução as keys usadas para traduzir o VRDatatables:

```json
{
  "COMMONS": {
    "CANCELAR": "Cancelar",
    "EDITAR": "Editar",
    "EXCLUIR": "Excluir",
    "MOVER": "Mover",
    "CONGELAR": "Congelar",
    "DESCONGELAR": "Descongelar",
    "AVANCAR": "Avançar"
  },
  "PAGE-SIZE": {
    "MOSTRAR": "Mostrar",
    "POR-PAGINA": "por página"
  },
  "MOVE-COLUMN": {
    "EDITAR": "Editar tabela",
    "CANCELAR": "Cancelar edição",
    "SALVAR": "Salvar tabela"
  },
  "TOGGLE-COLUMN": {
    "ALTERAR": "Alterar Colunas",
    "CONFIG": {
      "OCULTAR-EXIBIR": "Ocultar / Exibir Colunas",
      "APLICAR": "Aplicar",
      "RESTAURAR": "Restaurar Padrão"
    }
  },
  "PRINT-TABLE": {
    "PRINT": "Imprimir"
  },
  "EXPORT-FILE": {
    "EXPORT": "Exportar",
    "EXPORTAR-ENVIAR": "Exportar e enviar arquivos",
    "EXPORTAR": "Exportar",
    "SELECIONAR-FORMATO": "Selecione o formato de arquivo",
    "RELATORIO": "Relatório",
    "EXCEL": "Excel",
    "ARQUIVO": "Arquivo",
    "APLICAR": "APLICAR"
  },
  "EXPORT-CONFIG": {
    "PAGINA": "PÁGINA",
    "ATUAL": "ATUAL",
    "TODAS": "TODAS",
    "INFO": "Recurso disponível apenas em tabelas que possuem paginação. Após a geração do relatório em segundo plano será disponibilizado para download na notificação",
    "COLUNA": "COLUNA",
    "GERAR": "GERAR",
    "PDF": {
      "IMPRESSAO": "IMPRESSÃO",
      "RETRATO": "RETRATO",
      "PAISAGEM": "PAISAGEM"
    }
  },
  "FIRE-EVENT-SELECTED": {
    "ITENS-SELECIONADOS": "Itens Selecionados"
  },
  "MESSAGE": {
    "NO-DATA": "Nenhum dado encontrado",
    "OF": "itens selecionados de",
    "ITEMS": "itens",
    "ITEMS-PER-PAGE": "Itens por página",
    "SELECIONADOS-HABILITAR": "Selecione pelo menos um registro na tabela para habilitar o botão."
  }
}
```

Instale "peer dependencies":

- `"@angula/common": ">=18.2.0`
- `"@angula/core": ">=18.2.0`
- `"@angula/cdk": ">=18.2.0`
- `"@vrsoftb/vr-design-guide": ">=3.5.0`
- `"@vrsoftb/vr-file-export": "^1.0.6`
- `"@vrsoftb/vr-components": ">=16.0.0`
- `"jspdf": "2.4.0`
- `"rxjs": ">=7.8.0`
- `"dexie": ">=3.2.4`
- `"dexie-observabl": ">=4.0.1-beta.13`
- `"angular-imask": ">=7.6.`
- `"tslib": "^2.3.0`

```
 npm install @angular/common@18.2.0 @angular/core@18.2.0 @angula/cdk@18.2.0 tslib@2.3.0 --save
```

```
 npm install jspdf@2.4.0 rxjs dexie dexie-observabl angular-imask --save
```

```
 npm install @vrsoftb/vr-design-guide @vrsoftb/vr-file-export@1.0.6 @vrsoftb/vr-components --save
```

## Install VRDatatables

```
 npm install @vrsoftbr/vrc-datatables --save

```

imports SCSS

```
@vrsoftbr/vrc-datatables/assets/themes/index.scss
@vrsoftbr/vrc-datatables/assets/vrc-datatable.scss
```

### Adicionar o módulo ao seu projeto

No Module do seu projeto/componente, adicione o modulo do VrcDatatablesModule.

```typescript
VrcDatatablesModule;
```

Ou passe as keys de tradução diretamente no módulo (opcional):

```typescript
  VrcDatatablesModule.forRoot(
    {
      messages: {
        emptyMessage: 'MESSAGE.NO-DATA',
        ofMessage: 'MESSAGE.OF',
        itemsMessage: 'MESSAGE.ITEMS',
        itemsPerPageMessage: 'MESSAGE.ITEMS-PER-PAGE',
      },
    },
  ),
```

## Uso

<!-- prettier-ignore -->
```typescript
@Component({
  selector: 'vr-datatable-basico',
  template: `
  <vrc-datatable
    #myTable
    [groupRowsBy]="'gender'"
    [rows]="rows"
    [scrollbarH]="true"
    [columnMode]="ColumnMode.force"
    rowHeight="auto"
    [count]="page.totalElements"
    [selectAllRowsOnPage]="false"
    [displayCheck]="displayCheck"
    (page)="setPage($event)"
    [clickableRows]="clickableRows"
    (exportAll)="onExportAll($event)"
    [showToolsBar]="false"
    [disableExportAll]="false"
  >
    <vrc-datatable-column
      [resizeable]="false"
      [sortable]="false"
      [draggable]="false"
      [canAutoResize]="false"
    >
      <ng-template
        let-row="row"
        let-expanded="expanded"
        vrc-datatable-cell-template
      >
        <a
          href="javascript:void(0)"
          [class.datatable-icon-right]="false"
          [class.datatable-icon-down]="false"
          title="Expand/Collapse Row"
          (click)="toggleExpandRow(row)"
        >
        </a>
      </ng-template>
    </vrc-datatable-column>

    <vrc-datatable-column name="Name"></vrc-datatable-column>
    <vrc-datatable-column name="Gender"></vrc-datatable-column>
    <vrc-datatable-column name="Company"></vrc-datatable-column>
  </vrc-datatable>`,
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
```
