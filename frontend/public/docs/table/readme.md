<p  align="center">

<h1  align="center">VR Table</h1>

</p>

[![Angular](https://img.shields.io/badge/angular-v18-red.svg)]([https://github.com/angular/angular-cli)
[![TypeScript](https://img.shields.io/badge/100%25-TypeScript-blue.svg)](https://www.typescriptlang.org)

**vr table é uma biblioteca [Angular](https://angular.io) (>=18) com componentes reutilizáveis.**

---

## Pré Requisitos

Instale "peer dependencies":

- `"@angula/common": ">=18.2.0`
- `"@angula/core": ">=18.2.0`
- `"@vrsoftb/vr-design-guide": ">=3.5.0`
- `"@vrsoftb/vr-file-export": "^1.0.6`
- `"jspdf": "2.4.0`
- `"rxjs": ">=7.8.0`
- `"tslib": "^2.3.0`

```
 npm install @angular/common@18.2.0 @angular/core@18.2.0 tslib@2.3.0 --save
```

```
 npm install jspdf@2.4.0 rxjs --save
```

```
 npm install @vrsoftb/vr-design-guide @vrsoftb/vr-file-export@1.0.6 --save
```

## Install VRTable

```
 npm install @vrsoftbr/vr-table --save

```

imports SCSS

```
@vrsoftbr/vr-table/assets/themes/index.scss
@vrsoftbr/vr-table/assets/vrc-table.scss
@vrsoftbr/vr-table/assets/icons/icons.scss
```

No Module do seu projeto/componente, adicione como provider o pipe de tradução ao modulo do VrcTableModule.

```typescript
VrcTableModule;
```

## Uso

<!-- prettier-ignore -->
```typescript
@Component({
  selector: 'vr-table-checkbox',
  template: `
    <vrc-table
      [rows]="rows"
      [columnMode]="ColumnMode.force"
      [headerHeight]="3.125"
      [footerHeight]="3.125"
      rowHeight="auto"
      [selected]="selected"
      [selectionType]="SelectionType.checkbox"
      [selectAllRowsOnPage]="false"
      [displayCheck]="displayCheck"
      (select)="onSelect($event)"
      (activate)="onActivate($event)"
      [scrollbarH]="true"
      [clickableRows]="true"
    >
      <vrc-table-column
        [width]="3.75"
        [sortable]="false"
        [canAutoResize]="false"
        [draggable]="false"
        [resizeable]="false"
        [headerCheckboxable]="true"
        [checkboxable]="true"
      >
      </vrc-table-column>
      <vrc-table-column name="Id" dataType="id"></vrc-table-column>
      <vrc-table-column name="First Name" prop="first_name"></vrc-table-column>
      <vrc-table-column name="Last Name" prop="last_name"></vrc-table-column>
      <vrc-table-column name="Email" minWidth="18.75"></vrc-table-column>
      <vrc-table-column name="company"></vrc-table-column>
      <vrc-table-column name="gender"></vrc-table-column>
      <vrc-table-column name="date" dataType="dataHora"></vrc-table-column>
      <vrc-table-column name="value" dataType="numerico"></vrc-table-column>
      <vrc-table-column name="version"></vrc-table-column>
      <vrc-table-column name="Ip Address" prop="ip_address"></vrc-table-column>
      <vrc-table-column name="phone"></vrc-table-column>
      <vrc-table-column name="job" [minWidth]="12.5"></vrc-table-column>
      <vrc-table-column name="app_name" prop="app_name"></vrc-table-column>
      <vrc-table-column
        name="creadit_card"
        prop="creadit_card"
      ></vrc-table-column>
      <vrc-table-column name="city" [minWidth]="12.5"></vrc-table-column>
      <vrc-table-column name="country" [minWidth]="12.5"></vrc-table-column>
    </vrc-table>
  `,
})
export class TableCheckboxComponent implements OnInit {
  rows = new Array<Contact>();

  ColumnMode = ColumnMode;

  selected: unknown[] = [];

  SelectionType = SelectionType;

  constructor(private serverResultsService: MockServerResultsService) {}

  ngOnInit(): void {
    this.serverResultsService.getResultsJson(20).subscribe((data) => {
      this.rows = data;
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

  onActivate(_: IDtEvents<CorporateEmployee>): void {
    /** empty */
  }

  displayCheck(row: { name: string }): boolean {
    return row.name !== 'Ethel Price';
  }
}
```
