# VR Dialog Modal Service
Esse serviço é utilizado para geração do `VrcDialogModalComponent`.
O `VrcDialogModalComponent` é uma caixa de dialogo, onde podem ser personalizado, o titulo, a mensagem, os botões (confirma e cancelar), o componente retorna true quando clicado no botão de confirmação, e false quando clicado no botão de cancelamento. 

## Como usar o servico e `VrcDialogModalService` componente `VrcDialogModalComponent`:
Para utilizar um modal customizado na aplicação é necessário importa nos modulos main ou app da aplicação o modulo `VrCommonModule`, e utilizar a tag `ng-template` junto com a diretiva `vrcDialogModal`.

```typescript
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [VrCommonModule],
})
export class MainModule {}

```

Main Component:
```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <main class="wrapper">
      <ng-template vrcDialogModal ></ng-template>
    </main>
  `,
})
export class MainComponent {}

```

### Referentciando o modal na pagina.
Dentro da pagina onde deseja utilizar o dialog modal deve injetar o servico `VrcDialogModalService` e implementar o metodo `showDialogModal`.

Detro do metodo` showDialogModal` utilize o metodo `showDialogModal` do `VrcDialogModalService` e passe como parametro o componente `VrDialogModalComponent` e as options, valores que das propiedade devinidos no component do modal. 

### Opções
As opções devem ser passado em formado de objeto.


| _Properties     | Tipo                   | Default            | Descrição                                          |
| --------------- | ---------------------- | ------------------ | -------------------------------------------------- |
| title           | string                 | `Atenção`          | define o titulo do modal                           |
| message         | string                 | `Deseja continuar` | define o texto do copo do modal                    |
| confirmText     | string                 | `Sim`              | define o texto do botão de confirmação             |
| cancelText      | string                 | `Não`              | define o texto do botão de cancelamento            |
| confirm         | boolean                | `true`             | define se o botão de confirmação será exibido      |
| cancel          | boolean                | `true`             | define se o botão de cancelamento será exibido     |
| isOverlayCancel | boolean                | `false`            | define compotamento ao clicar fora do modal        |



## Exemplo

### Pagina 
Como referenciar o showDialogModal em um component.

Injete o serviço `VrcDialogModalService` e declare o metodo de `showDialogModal`

```typescript
import { Component } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { VrcDialogModalService } from 'vrc-components';

import { MarkdownCommon } from '../../../models/markdown.common';

@Component({
  selector: 'vr-dialog-modal',
  templateUrl: './vr-dialog-modal.component.html',
  styleUrls: ['./vr-dialog-modal.component.scss']
})
export class VrDialogModalComponent extends MarkdownCommon {

  returnDialogModal$!: Observable<any>;

  constructor(
    private readonly _vrcDialogModalService: VrcDialogModalService,
  ) {
    super();
  }

  showDialogModal(): void {
    const dialogModalService = this._vrcDialogModalService.showDialogModal();

    this.returnDialogModal$ = merge(dialogModalService.confirm$, dialogModalService.cancel$) 
  }
}

```


