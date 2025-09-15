# VR Datepicker

O datepicker utiliza o valor no formato de _text_ como por exemplo '20/02/2019'

### Como usar o componente `VrcDatepickerComponent` :

Para usar o vr datepicker precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcDatepickerModule } from 'vrc-components';

@NgModule({
  imports: [VrcDatepickerModule],
})
export class MyModule {}
```

template:

```html
<vrc-datepicker id="dataId" [(ngModel)]="data"></vrc-datepicker>
```

Vinculando o valor.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'vr-my',
  template: '<vrc-datepicker label="Exemplo"  type="text" isRequired="true"  [(ngModel)]="valor"></vrc-datepicker>',
})
export class MyComponent {
  data = '05/01/2020';
}
```

## Propriedades

Propriedades _@Input()_

|                   |                                                                                  | Valor                  | Valor Padrão             |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------- | ------------------------ |
| id                | define um id para o elemento _input_                                             | string                 |                          |
| classeCss         | seta classe css para todo o componente                                           | string                 |                          |
| name              | define um _name_ para o elemento _input_                                         | string                 | ""                       |
| label             | define um _label_ para o elemento _input_                                        | string                 |                          |
| control           | utilizando em formulários reativos                                               | FormControl            |                          |
| placeholder       | define o _placeholder_ para o elemento input                                     | string                 | ""                       |
| isReadOnly        | define o _input_ como apenas leitura (_readonly_)                                | boolean                | false                    |
| isDisabled        | define o _input_ como desabilitado (_disabled_)                                  | boolean                | false                    |
| isRequired\*      | define o _input_ como obrigatório (_required_)                                   | boolean                | false                    |
| useNonWorkingDays | utilizando quando precisa informar os dias não uteis providos de uma API externa | boolean                | false                    |
| isDateRange       | define se deve ser selecionado um período ao invés de uma única data             | boolean                | false                    |
| isDateTime        | define se deve ser selecionado as horas e os minutos                             | boolean                | false                    |
| showShortcuts     | define se deve os atalhos de data serão mostrados                                | boolean                | false                    |
| calendarPosition  | define a posição que o calendário aparecerá quando aberto                        | enum ECalendarPosition | ECalendarPosition.BOTTOM |
| disablePastDates  | desabilita dias retroativos                                                      | boolean                | false                    |

\* Em formulários reativos não precisa declarar se é obrigatório, pois é definido na construção do _FormGroup_

### Exemplo Formulário Reativo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'vr-my',
  template: ` <form [formGroup]="formGroup">
    <vrc-datepicker label="Data" formControlName="data" [control]="getField('data')"> </vrc-datepicker>
  </form>`,
})
export class MyComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      data: [null, Validators.required],
    });
  }

  getField(field: string): any {
    return this.formGroup.get(field);
  }
}
```
