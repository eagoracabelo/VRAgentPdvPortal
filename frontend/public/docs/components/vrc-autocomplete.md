# VR Autocomplete

### Como usar o componente `VrcAutocompleteComponent` :

Para usar o vr autocomplete precisa importar os modulos VrcAutocompleteModule e VrcOptionModule.

```typescript
import { NgModule } from '@angular/core';

import { VrcAutocompleteModule, VrcOptionModule } from 'vrc-components';

@NgModule({
  imports: [VrcAutocompleteModule, VrcOptionModule],
})
export class MyModule {}
```

template:

```html
<vrc-autocomplete label="Opções" [(ngModel)]="value">
  <vrc-option value="Primeiro">1 - Primeiro </vrc-option>
  <vrc-option value="Segundo">2 - Segundo </vrc-option>
  <vrc-option value="Terceiro">3 - Terceiro</vrc-option>
</vrc-autocomplete>
```

Vinculando o valor.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'vr-my',
  template: ` <vrc-autocomplete label="Opções" [(ngModel)]="valor">
    <vrc-option value="Primeiro">1 - Primeiro </vrc-option>
    <vrc-option value="Segundo">2 - Segundo </vrc-option>
    <vrc-option value="Terceiro">3 - Terceiro</vrc-option>
  </vrc-autocomplete>`,
})
export class MyComponent {
  valor!: string;
}
```

## Propriedades

Propriedades _@Input()_

|              |                                                   |
| ------------ | ------------------------------------------------- |
| id           | define um id para o elemento _input_              |
| classeCss    | seta classe css para todo o componente            |
| name         | define um _name_ para o elemento _input_          |
| label        | define um _label_ para o elemento _input_         |
| control      | utilizando em formulários reativos                |
| placeholder  | define o _placeholder_ para o elemento input      |
| isReadOnly   | define o _input_ como apenas leitura (_readonly_) |
| isDisabled   | define o _input_ como desabilitado (_disabled_)   |
| isRequired\* | define o _input_ como obrigatório (_required_)    |

\* Em formulários reativos não precisa declarar se é obrigatório, pois é definido na construção do _FormGroup_

### Exemplo Formulário Reativo

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs';

@Component({
  selector: 'vr-my',
  template: ` <form [formGroup]="formGroup">
    <vrc-autocomplete label="Estado" formControlName="estado" [control]="getField('estado')">
      @for (estado of filteredOptions | async; track $index) {
        <vrc-option [value]="estado">
          <span>{{ estado }}</span>
        </vrc-option>
      }
    </vrc-autocomplete>
  </form>`,
})
export class MyComponent implements OnInit {
  filteredOptions!: Observable<string[]>;

  estados = [
    {
      id: 1,
      sigla: 'SP',
      nome: 'São Paulo',
    },
    {
      id: 2,
      sigla: 'BA',
      nome: 'Bahia',
    },
    {
      id: 3,
      sigla: 'PR',
      nome: 'Paraná',
    },
    {
      id: 4,
      sigla: 'AM',
      nome: 'Amazonas',
    },
  ];

  formGroup!: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  getField(field: string): any {
    return this.formGroup.get(field);
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      estado: [null, Validators.required],
    });
  }

  private filterEstados(): void {
    this.filteredOptions = this.getField('estado')?.valueChanges.pipe(
      startWith(''),
      map((v: string) => this.filter(v)),
    );
  }

  private filter(value: string): string[] {
    const filterValue = value?.toLowerCase();
    return this.estados.map((estado) => estado?.nome ?? '').filter((option) => option.toLowerCase().includes(filterValue));
  }
}
```
