# VR Textarea

### Como usar o componente `VrcTextareaComponent` :

Para usar o vr textarea precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from "@angular/core";

import { VrcTextareaModule } from "vrc-components";

@NgModule({
  imports: [VrcTextareaModule],
})
export class MyModule {}
```

template:

```html
<vrc-textarea [(ngModel)]="valor"></vrc-textarea>
```

Vinculando o valor.

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "vr-my",

  template:
    '<vrc-textarea label="Exemplo" rows="5" isRequired="true" [(ngModel)]="valor"></vrc-textarea>',
})
export class MyComponent {
  valor = "";
}
```

## Propriedades

Propriedades _@Input()_

|              |                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------ |
| id           | define um id para o elemento _input_                                                             |
| classeCss    | seta classe css para todo o componente                                                           |
| name         | define um _name_ para o elemento _input_                                                         |
| label        | define um _label_ para o elemento _input_                                                        |
| type         | define um _type_ para o elemento _input_, por padrão se inicializa como _text_                   |
| control      | utilizando em formulários reativos                                                               |
| placeholder  | define o _placeholder_ para o elemento input                                                     |
| isReadOnly   | define o _input_ como apenas leitura (_readonly_)                                                |
| isDisabled   | define o _input_ como desabilitado (_disabled_)                                                  |
| isRequired\* | define o _input_ como obrigatório (_required_)                                                   |
| maxlength    | especifica um número máximo de caracteres que o 'textarea' tem permissão para conter.            |
| minlength    | especifica um número mínimo de caracteres que o 'textarea' tem permissão para conter.            |
| row          | O número de linhas de texto visíveis para o controle.                                            |
| spellcheck   | Especifica se o 'textarea' está sujeito a verificação ortográfica pelo navegador / SO subjacente |
| wrap         | Indica como o controle quebra o texto.                                                           |

\* Em formulários reativos não precisa declarar se é obrigatório, pois é definido na construção do _FormGroup_

Para mais informações acesse [aqui](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/textarea).

### Exemplo Formulário Reativo

```typescript
import { Component, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "vr-my",

  template: ` <form [formGroup]="formGroup">
    <vrc-textarea
      label="Descrição"
      formControlName="descricao"
      [control]="getField('descricao')"
    >
    </vrc-textarea>
  </form>`,
})
export class MyComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      descricao: [null, Validators.required],
    });
  }

  getField(field: string): any {
    return this.formGroup.get(field);
  }
}
```
