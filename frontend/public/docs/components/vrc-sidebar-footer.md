# VR Sidebar Footer
</br>
Esse componente contém o logo da VR Software seguido das versões do front-end e do back-end. 

Ele pode ter seu layout alterado de acordo com o valor recebido no _@Input()_ _sidebarExpanded_.

### Como usar o componente `VrcSidebarFooterComponent` :

Para usar o sidebar footer é necessário importar o módulo VrcSidebarFooterModule.

```typescript
import { NgModule } from '@angular/core';

import { VrcSidebarFooterModule } from 'vrc-components';

@NgModule({
  imports: [VrcSidebarFooterModule],
})
export class MyModule {}
```

template:

```html
<vrc-sidebar-footer
  [versao]="versao"
  [versaoAPI]="versaoAPI"
  [sidebarExpanded]="false"
></vrc-sidebar-footer>
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()          | Tipo       | Default | Descrição                                                              |
| ----------------- | ---------- | ------- | ---------------------------------------------------------------------- |
| versao\*       | string | `''`    | obtém um array de JSON na estrutura acima, para construir o menu       |
| versaoAPI\*       | string | `''`    | obtém um array de JSON na estrutura acima, para construir o menu       |
| sidebarExpanded\* | boolean    | `false` | obtém um boolean identificando se a sidebar está expandida ou retraída |
