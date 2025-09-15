# VR Modal Service

Esse serviço é utilizado para geração dos modais, de customizados.

## Como usar o servico `VrcModalService`:

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
      <ng-template vrcDialogModal></ng-template>
    </main>
  `,
})
export class MainComponent {}
```

## Componente de Modal

O Modal é um componente que deve seguir algumas regras para que possa ser gerado de forma dinamica e seja possivel observar os eventos de confirmação e cancelamento do modal.

Dentro do componente que foi criado deve injetar o serviço `VrModalService` e implementar os metodos `onConfirm`, `onCancel`, `onClose`, `overlayCancel`.

Caso queira que ao clicar fora do modal ele seje fechado, declare a propriedade `isOverlayCancel` e o metodo `overlayCancel`.

```typescript
@Component({
  templateUrl: './vr-dialog-modal-custom-exemple.component.html',
  styleUrls: ['./vr-dialog-modal-custom-exemple.component.scss'],
})
export class VrDialogModalCustomExempleComponent {
  title = 'Custom Modal';
  isOverlayCancel = false;

  vrcImputValue!: string;

  constructor(private readonly _vrcModalService: VrcModalService) {}

  onConfirm(): void {
    this._vrcModalService.onConfirm(this.vrcImputValue);
  }

  onConfirmAndNotClose(): void {
    this._vrcModalService.onConfirmAndNotClose(this.vrcImputValue);
    this.vrcImputValue = '';
  }

  onCancel(): void {
    this._vrcModalService.onCancel(false);
  }

  onClose(): void {
    this._vrcModalService.onClose();
  }

  overlayCancel(): void {
    this.isOverlayCancel && this.onClose();
  }
}
```

Template:

```html
<div class="modal">
  <section class="modal__header">
    <h3>{{ title }}</h3>
    <i (click)="onClose()" class="vr vr-fechar"></i>
  </section>

  <section class="modal__content">
    <vrc-input [(ngModel)]="vrcImputValue"></vrc-input>
  </section>

  <section class="modal__options">
    <button class="btn btn--default" (click)="onConfirmAndNotClose()">
      {{ confirmAndAddText }}
    </button>
    <button class="btn btn--default" (click)="onConfirm()">
      {{ confirmText }}
    </button>
  </section>
</div>
```

### Referentciando o modal na pagina.

Dentro da pagina onde deseja utilizar o modal criado deve injetar o servico `VrcModalService` e implementar o metodo `showModal`.

Detro do metodo` showModal` utilize o metodo `onOpen` do `VrcModalService` e passe como parametro o componente de modal que deseja criar dinamincamente e as options, valores que das propiedade devinidos no component do modal.

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { VrDialogModalCustomExempleComponent } from '../vr-dialog-modal-custom/vr-dialog-modal-custom-exemple/vr-dialog-modal-custom-exemple.component';

@Component({
  selector: 'vr-dialog-modal',
  templateUrl: './vr-dialog-modal.component.html',
  styleUrls: ['./vr-dialog-modal.component.scss'],
})
export class VrDialogModalComponent extends MarkdownCommon {
  returnModal$!: Observable<any>;

  constructor(private readonly _vrcModalService: VrcModalService) {
    super();
  }

  showModal(): void {
    const options = {
      title: 'Custon Modal',
      message: '',
      confirmText: 'Selecionar',
      confirmAndAddText = 'Selecionar sem fechar',
      isOverlayCancel: true,
    };

    const dialogModalCuston = this._vrcModalService.onOpen(
      VrDialogModalCustomExempleComponent,
      options,
    );

    this.returnModal$ = dialogModalCuston.confirm$;
  }
}
```
