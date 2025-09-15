# VR Input

### Como usar o componente `VrcInputComponent` :

Para usar o vr input precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcInputModule } from 'vrc-components';

@NgModule({
  imports: [VrcImputModule],
})
export class MyModule {}
```

template:

```html
<vrc-input type="text" [(ngModel)]="valor"></vrc-input>
```

Vinculando o valor.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'vr-my',
  template: '<vrc-input label="Exemplo"  type="text" isRequired="true"  [(ngModel)]="valor"></vrc-input>',
})
export class MyComponent {
  valor = '';
}
```

## Propriedades

Propriedades _@Input()_

|                  |                                                                                |
| ---------------- | ------------------------------------------------------------------------------ |
| id               | define um id para o elemento _input_                                           |
| classeCss        | seta classe css para todo o componente                                         |
| name             | define um _name_ para o elemento _input_                                       |
| label            | define um _label_ para o elemento _input_                                      |
| type             | define um _type_ para o elemento _input_, por padrão se inicializa como _text_ |
| control          | utilizando em formulários reativos                                             |
| placeholder      | define o _placeholder_ para o elemento input                                   |
| isReadOnly       | define o _input_ como apenas leitura (_readonly_)                              |
| isDisabled       | define o _input_ como desabilitado (_disabled_)                                |
| isRequired\*     | define o _input_ como obrigatório (_required_)                                 |
| showTimeIcon     | define o se o ícone de hora será exibido                                       |
| hideErrorMessage | define se as mensagens de erro serão exibidas                                  |
| rtl              | define a digitacao da direita para a esquerda e o formato '0.000,00'           |
| currency         | habilita o rtl e define um prefixo de moeda ex: currency='R$' -> 'R$ 0.000,00' |
| onFocusEvent     | adiciona listener para o evento de "Focus"                                     |
| onBlurEvent      | adiciona listener para o evento de "Blur"                                      |

\* Em formulários reativos não precisa declarar se é obrigatório, pois é definido na construção do _FormGroup_

### Exemplo Formulário Reativo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'vr-my',
  template: ` <form [formGroup]="formGroup">
    <vrc-input id="cpfcnpjId" label="CPF/CNPJ" formControlName="cnpjcpf" [control]="getField('cnpjcpf')"> </vrc-input>
  </form>`,
})
export class MyComponent implements OnInit {
  formGroup!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      cnpjcpf: [null, Validators.required],
    });
  }

  getField(field: string): any {
    return this.formGroup.get(field);
  }
}
```
