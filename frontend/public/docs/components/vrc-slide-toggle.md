# VR Slide Toggle

### Como usar o componente `VrcSlideToggleComponent` :

Para usar o vr slide toggle precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcSlideToggleModule } from 'vrc-components';

@NgModule({
  imports: [VrcSlideToggleModule],
})
export class MyModule {}
```

template:

```html
<vrc-slide-toggle [(ngModel)]="isChecked">Ok?</vrc-slide-toggle>
```

Vinculando o valor.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'vr-my',
  template: '<vrc-slide-toggle [(ngModel)]="isChecked" >Ok?</vrc-slide-toggle>',
})
export class MyComponent {
  isChecked = false;
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

### Exemplo Formulário Reativo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { VrcFormValidations } from 'vrc-components';

@Component({
  selector: 'vr-my',
  template: `<form [formGroup]="formGroup">
    <div class="row">
      <div class="col-sm-12">
        @for (item of formFrameworks?.controls; track $index; let i = $index) {
          <ng-container formArrayName="frameworks">
            <vrc-slide-toggle [formControlName]="i">{{ frameworks[i] }}</vrc-slide-toggle>
          </ng-container>
        }
      </div>
    </div>
  </form>`,
})
export class MyComponent implements OnInit {
  formGroup!: FormGroup;
  frameworks = ['Angular', 'React', 'Vue'];
  constructor(private formBuilder: FormBuilder) {}

  get formFrameworks(): FormArray {
    return this.formGroup.get('frameworks') as FormArray;
  }

  ngOnInit(): void {
    this.buildForm();
  }

  getField(field: string): any {
    return this.formGroup.get(field);
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      frameworks: this.buildFrameworks(),
    });
  }

  private buildFrameworks(): FormArray {
    const values = this.frameworks.map((v) => new FormControl(false));
    return this.formBuilder.array(values, VrcFormValidations.requiredMinChebox());
  }
}
```
