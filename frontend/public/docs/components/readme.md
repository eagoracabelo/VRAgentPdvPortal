<p  align="center">

<h1  align="center">VR COMPONENTS</h1>

</p>

[![Angular](https://img.shields.io/badge/angular-v18-red.svg)]([https://github.com/angular/angular-cli)
[![TypeScript](https://img.shields.io/badge/100%25-TypeScript-blue.svg)](https://www.typescriptlang.org)

**vr components é uma biblioteca [Angular](https://angular.io) (>=18) com componentes reutilizáveis.**

## Pré Requisitos

Instale "peer dependencies":

- `"@angular/common": ">=18.2.0"`
- `"@angular/core": ">=18.2.0"`
- `"@angula/cdk": ">=18.2.0"`
- `"@vrsoftbr/vr-design-guide": ">=3.5.0"`
- `"lodash": ">=4.17.0"`
- `"angular-imask": ">=7.6.0"`
- `"@ngneat/cashew": ">=4.1.0"`
- `"rxjs": ">=7.8.0"`
- `"tslib": "^2.3.0`

```
 npm install @angular/common@18.2.0 @angular/core@18.2.0 @angula/cdk@18.2.0 tslib@2.3.0 --save
```

```
 npm install lodash angular-imask @ngneat/cashew rxjs --save
```

```
 npm install @vrsoftb/vr-design-guide --save
```

---

## Install

```
 npm install @vrsoftb/vr-components --save

```

### Tradução

No AppModule do seu projeto, adicione como provider o pipe de tradução.

```typescript
  { provide: ETokens.TRANSLATOR_TOKEN, useClass: TranslatorPipe },
```

## Uso

### No módulo importa-se o componente necessário, por exemplo o `VrcDatepickerModule` no seu app.

Adicione `VrcDatepickerModule` no `imports` do App.

```typescript
import { NgModule } from '@angular/core';

import { VrcDatepickerModule } from 'vrc-components';

@NgModule({
  imports: [VrcDatepickerModule],
})
export class AppModule {}
```

### Como usar um componente como `VrcDatepickerComponent` no template:

#### Vinculando('Binding') para propriedade `data`

Vincule o valor de remarcação à propriedade de `value` do componente de apresentação.

```html
<vrc-datepicker [value]="data" label="Data"></vrc-datepicker>
```

Vinculando o valor com _tow way data binding_.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'vr-root',
  template: '<vrc-datepicker  [(ngModel)]="data"  [useNonWorkingDays]="false"  label="Data"></vrc-datepicker>',
})
export class AppComponent {
  data = '01/01/2020';

  // ...
}
```
