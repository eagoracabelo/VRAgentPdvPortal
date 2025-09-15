# VR Sidebar

</br>

Esse componente constrói uma sidebar completa com botão toggle, header, menu e footer utilizando os componentes específicos de cada um, sendo eles: VrcSidebarToggle, VrcSidebarHeader, VrcSidebarMenu e VrcSidebarFooter.

Esses componentes também podem ser utilizados separadamente para personalizar a sidebar, conforme exemplo na seção **Sidebar Personalizada** dessa página, bem como na aba **Exemplo Personalizado**.

### Como usar o componente `VrcSidebarComponent` :

Quando esse componente é utilizado, permite que o script js "sidebar.min.js" seja removido do arquivo angular.json, já que o componente possui as mesmas funcionalidades do script.

Para usar o vr sidebar é necessário importar o módulo VrcSidebarModule.

```typescript
import { NgModule } from '@angular/core';

import { VrcSidebarModule } from 'vrc-components';

@NgModule({
  imports: [VrcSidebarModule],
})
export class MyModule {}
```

template:

```html
<vrc-sidebar
  [sidebarMenu]="menuItens"
  [versao]="versao"
  [versaoAPI]="versaoAPI"
  [logoRoute]="logoRoute"
  [logoSource]="logoSource"
  [mainCSSClass]="'sidebar-container'"
></vrc-sidebar>
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()       | Tipo       | Default          | Descrição                                           |
| -------------- | ---------- | ---------------- | --------------------------------------------------- |
| sidebarMenu    | JSON Array | `[]`             | obtém um array de JSON para construir o menu        |
| logoSource     | string     | `''`             | obtém o caminho para imagem do logo                 |
| logoRoute\*    | string     | `''`             | obtém a rota para quando o usuário clicar no logo   |
| versao\*       | string     | `''`             | obtém a versão do front-end para preencher o footer |
| versaoAPI\*    | string     | `''`             | obtém a versão do back-end para preencher o footer  |
| mainCSSClass\* | string     | `'main-sidebar'` | altera a classe css principal da sidebar            |

### Como montar uma sidebar personalizada :

É possível montar a sidebar utilizando os componentes que a compõe: VrcSidebarToggle, VrcSidebarHeader, VrcSidebarMenu e VrcSidebarFooter.

Pra fazer isso, importe o módulo de cada um.

```typescript
import { NgModule } from '@angular/core';

import {
  VrcSidebarToggleModule,
  VrcSidebarHeaderModule,
  VrcSidebarMenuModule,
  VrcSidebarFooterModule,
} from 'vrc-components';

@NgModule({
  imports: [
    VrcSidebarToggleModule,
    VrcSidebarHeaderModule,
    VrcSidebarMenuModule,
    VrcSidebarFooterModule,
  ],
})
export class MyModule {}
```

template:

```html
<aside
  class="sidebar-container"
  [ngClass]="{ 'sidebar-expanded': sidebarExpanded }"
>
  <vrc-sidebar-toggle
    [disableDOMBodyCSSChange]="false"
    (toggleSidebarEvent$)="toggleSidebar($event)"
  ></vrc-sidebar-toggle>

  <vrc-sidebar-header
    [logoRoute]="logoRoute"
    [imgSource]="logoSource"
    [sidebarExpanded]="sidebarExpanded"
  ></vrc-sidebar-header>

  <vrc-sidebar-menu
    [sidebarMenu]="menuItens"
    [sidebarExpanded]="sidebarExpanded"
  ></vrc-sidebar-menu>

  <div class="sidebar-footer-container">
    <vrc-sidebar-footer
      [versao]="versao"
      [versaoAPI]="versaoAPI"
      [sidebarExpanded]="sidebarExpanded"
    ></vrc-sidebar-footer>
  </div>
</aside>
```

## Propriedades dos componentes da sidebar

Propriedades marcadas com \* sao opcionais

| @Input()                  | Componente                                         | Tipo       | Default | Descrição                                                              |
| ------------------------- | -------------------------------------------------- | ---------- | ------- | ---------------------------------------------------------------------- |
| sidebarMenu               | VrcSidebarMenu                                     | JSON Array | `[]`    | obtém um array de JSON para construir o menu                           |
| imgSource                 | VrcSidebarHeader                                   | string     | `''`    | obtém o caminho para imagem do logo                                    |
| logoRoute\*               | VrcSidebarHeader                                   | string     | `''`    | obtém a rota para quando o usuário clicar no logo                      |
| disableDOMBodyCSSChange\* | VrcSidebarToggle                                   | boolean    | `false` | desabilita a inserção da classe sidebar-collapse no body               |
| versao\*                  | VrcSidebarFooter                                   | string     | `''`    | obtém a versão do front-end para preencher o footer                    |
| versaoAPI\*               | VrcSidebarFooter                                   | string     | `''`    | obtém a versão do back-end para preencher o footer                     |
| sidebarExpanded\*         | VrcSidebarHeader, VrcSidebarMenu, VrcSidebarFooter | boolean    | `false` | obtém um boolean identificando se a sidebar está expandida ou retraída |

| @Output()           | Componente       | Tipo         | Descrição                                                              |
| ------------------- | ---------------- | ------------ | ---------------------------------------------------------------------- |
| toggleSidebarEvent$ | VrcSidebarToggle | EventEmitter | obtém um boolean identificando se a sidebar está expandida ou retraída |
