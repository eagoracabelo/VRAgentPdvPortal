# VR Nav Toolbar
Esse componente é uma barra que ficará embaixo da sidebar quando utilizado, é possível adicionar componentes dentro dele que deverão servir como botões de ação.

O componente tem o layout dividido em duas partes, o título, alinhado a esquerda tomando 20% do espaço total da barra e os outros 80% da barra alinhados a direita são reservados para os botões de ação.

### Como usar o componente `VrcNavToolbar` :

Para usar o vrc-nav-toolbar é necessário importar o módulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcNavToolbarModule } from 'vrc-components';

@NgModule({
  imports: [VrcNavToolbarModule],
})
export class MyModule {}
```

template:

```html
<vrc-nav-toolbar [title]="'Titulo da página'">
  <button class="btn btn-default">Botão 1</button>
  <button class="btn btn-default">Botão 2</button>
</vrc-nav-toolbar>
```

## Propriedades

| _@Input()_ | Tipo   | Default     | Descrição                 |
| ---------- | ------ | ----------- | ------------------------- |
| title      | string | `undefined` | recebe o título da página |

### Exemplo

```typescript
import { Component } from '@angular/core';
('@angular/forms');

@Component({
  selector: 'vr-my',
  template: `
    <vrc-nav-toolbar [title]="pageTitle">
      <button class="btn btn-default">Botão 1</button>
      <button class="btn btn-default">Botão 2</button>
    </vrc-nav-toolbar>
  `,
})
export class MyComponent {
  pageTitle = 'Titulo da página';
}
```
