# VR Sidebar Toggle
</br>

Esse componente é um botão que controla a expansão ou contração da sidebar e também altera o css do body da aplicação para sinalizar aos componentes externos que o layout da sidebar foi alterado, dessa forma o "content-wrapper" pode se ajustar dinamicamente.

Note que essa alteração no body da aplicação **pode ser desabilitada** através do _@Input()_ _disableDOMBodyCSSChange_, por padrão ela está habilitada.

### Como usar o componente `VrcSidebarToggleComponent` :

Para usar o sidebar toggle é necessário importar o módulo VrcSidebarToggleModule.

```typescript
import { NgModule } from '@angular/core';

import { VrcSidebarToggleModule } from 'vrc-components';

@NgModule({
  imports: [VrcSidebarToggleModule],
})
export class MyModule {}
```

template:

```html
<vrc-sidebar-toggle
  [disableDOMBodyCSSChange]="false"
  (toggleSidebarEvent$)="toggleSidebar($event)"
></vrc-sidebar-toggle>
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()                  | Tipo    | Default | Descrição                                                              |
| ------------------------- | ------- | ------- | ---------------------------------------------------------------------- |
| sidebarExpanded\*         | boolean | `false`   | obtém um boolean identificando se a sidebar está expandida ou retraída |
| disableDOMBodyCSSChange\* | boolean | `false`   | desabilita a inserção da classe sidebar-collapse no body               |

| @Output()           | Tipo         | Descrição                                                              |
| ------------------- | ------------ | ---------------------------------------------------------------------- |
| toggleSidebarEvent$ | EventEmitter | obtém um boolean identificando se a sidebar está expandida ou retraída |
