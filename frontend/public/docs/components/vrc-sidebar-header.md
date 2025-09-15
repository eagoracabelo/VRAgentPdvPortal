# VR Sidebar Header
</br>

Esse componente contém o logo da aplicação junto de sua rota para navegação quando clicado.

Ele pode ter seu layout alterado de acordo com o valor recebido no _@Input()_ _sidebarExpanded_.

### Como usar o componente `VrcSidebarHeaderComponent` :

Para usar o sidebar header é necessário importar o módulo VrcSidebarHeaderModule.

```typescript
import { NgModule } from '@angular/core';

import { VrcSidebarHeaderModule } from 'vrc-components';

@NgModule({
  imports: [VrcSidebarHeaderModule],
})
export class MyModule {}
```

template:

```html
<vrc-sidebar-header
  [logoRoute]="logoRoute"
  [imgSource]="logoSource"
  [sidebarExpanded]="false"
></vrc-sidebar-header>
```

## Propriedades

Propriedades marcadas com \* sao opcionais.

| @Input()          | Tipo    | Default | Descrição                                                              |
| ----------------- | ------- | ------- | ---------------------------------------------------------------------- |
| imgSource         | string  | `''`      | obtém o caminho para imagem do logo                                    |
| logoRoute\*       | string  | `''`      | obtém a rota para quando o usuário clicar no logo                      |
| sidebarExpanded\* | boolean | `false`   | obtém um boolean identificando se a sidebar está expandida ou retraída |
