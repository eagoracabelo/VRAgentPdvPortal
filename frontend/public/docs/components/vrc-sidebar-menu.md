# VR Sidebar Menu
</br>

Esse componente monta um menu a partir de um **ARRAY de JSON**'s com a seguinte estrutura:

```json
{
    "id": 1,
    "titulo": "Titulo nível 1",             <-- título do menu
    "tooltip": "Tooltip nível 1",           <-- tooltip do menu
    "icone": "vr vr-tutorial",              <-- classe css do icone
    "rota": "/titulo1",                     <-- rota do menu para redirecionar ou ativar o routerLink
    "submenu": [                            <-- array de submenus com a mesma estrutura apresentada
        {
            "id": 2,
            "titulo": "Titulo 2",
            "tooltip": "Tooltip 2",
            "icone": "vr vr-marcador",
            "rota": "/titulo1/titulo2",     <-- rota do objeto superior concatenada com a nova rota **
            "submenu": []
        }
    ]
}
```

\*\* Os objetos filhos devem ter suas rotas concatenadas com a rota do seu objeto pai, dessa forma o sistema de roteamento do angular consegue entender quais rotas estão ativas e o layout pode ser aplicado corretamente aos menus.

### Como usar o componente `VrcSidebarMenuComponent` :

Para usar o sidebar menu é necessário importar o módulo VrcSidebarMenuModule.

```typescript
import { NgModule } from '@angular/core';

import { VrcSidebarMenuModule } from 'vrc-components';

@NgModule({
  imports: [VrcSidebarMenuModule],
})
export class MyModule {}
```

template:

```html
<vrc-sidebar-menu
  [sidebarMenu]="menuItens"
  [sidebarExpanded]="false"
></vrc-sidebar-menu>
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()          | Tipo       | Default | Descrição                                                              |
| ----------------- | ---------- | ------- | ---------------------------------------------------------------------- |
| sidebarMenu       | JSON Array | `[]`    | obtém um array de JSON na estrutura acima, para construir o menu       |
| sidebarExpanded\* | boolean    | `false` | obtém um boolean identificando se a sidebar está expandida ou retraída |
