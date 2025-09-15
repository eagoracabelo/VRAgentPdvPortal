# VR Radio

### Como usar os componentes `VrcRadioGroupComponent e VrcRadioButtonComponent` :

O radio e composto por dois componentes o grupo de radio e os botões de radio.

```typescript
import { NgModule } from '@angular/core';

import { VrcRadioModule } from 'vrc-components';

@NgModule({
  imports: [VrcRadioModule],
})
export class MyModule {}
```

template:

```html
<vrc-radio-group [(ngModel)]="place">
  <vrc-radio-button value="Casa">Em casa</vrc-radio-button>
  <vrc-radio-button value="Trabalho">No trabalho</vrc-radio-button>
  <vrc-radio-button value="Viajando">Viajando</vrc-radio-button>
</vrc-radio-group>
```

Vinculando o valor.

```typescript
import { Component } from  '@angular/core';

@Component({
selector:  'vr-my',
template:  '<vrc-radio-group  [(ngModel)]="place">
 <vrc-radio-button  value="Casa">Em casa</vrc-radio-button>
 <vrc-radio-button  value="Trabalho">No trabalho</vrc-radio-button>
 <vrc-radio-button  value="Viajando">Viajando</vrc-radio-button>
</vrc-radio-group>'
})
export  class  MyComponent{
place!:  string;
}
```

## Propriedades

Propriedades _@Input()_

|              |                                                   |
| ------------ | ------------------------------------------------- |
| id           | define um id para o elemento _input_              |
| classeCss    | seta classe css para todo o componente            |
| name         | define um _name_ para o elemento _input_          |
| control      | utilizando em formulários reativos                |
| isReadOnly   | define o _input_ como apenas leitura (_readonly_) |
| isDisabled   | define o _input_ como desabilitado (_disabled_)   |
| isRequired\* | define o _input_ como obrigatório (_required_)    |

\* Em formulários reativos não precisa declarar se é obrigatório, pois é definido na construção do _FormGroup_

Obs: Para alinha os botões verticalmente se usa a propriedade 'classeCss', passando a classe 'vertical-align'.

### Exemplo Formulário Reativo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { VrcFormValidations } from 'vrc-components';

@Component({
  selector: 'vr-my',
  template: `<form [formGroup]="formGroup">
    <div class="row">
      <div class="col-sm-6">
        <vrc-radio-group formControlName="gender" [control]="getField('gender')">
          @for (gender of genders; track $index) {
            <vrc-radio-button [value]="gender.value">{{ gender?.description }} </vrc-radio-button>
          }
        </vrc-radio-group>
      </div>
    </div>
  </form>`,
})
export class MyComponent implements OnInit {
  formGroup!: FormGroup;
  genders: Gender[] = [
    { value: 'M', description: 'Masculino' },
    { value: 'F', description: 'Feminino' },
    { value: 'O', description: 'Outro' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  getField(field: string): any {
    return this.formGroup.get(field);
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      gender: [null, Validators.required],
    });
  }
}
```
