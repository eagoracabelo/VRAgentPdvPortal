# VR Card Value

### Como usar o componente `VrcCardValueComponent` :

Para usar o vr card value precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcCardValueModule } from 'vrc-components';

@NgModule({
  imports: [VrcCardValueModule],
})
export class MyModule {}
```

template:

```html
<vrc-card-value title="TOTAL BAIXADO" [value]="valor"></vrc-card-value>
```

## Propriedades

Propriedades _@Input()_

|                |                                                                                    |
| -------------- | ---------------------------------------------------------------------------------- |
| title          | define o título do card, por default é 'TITLE'                                     |
| color          | define a cor do valor e da borda de baixo do card, por default é var(--color-text) |
| width          | define o tamanho do card, por default é 'max-content'                              |
| value          | define o valor a ser exibido, por default é 0                                      |
| mask           | define a máscara a ser aplicada no valor, por default é 'R$ 0,00'                  |
| secondaryValue | define o valor secondário a ser exibido, por default é undefined                   |
| mask           | define a máscara secondária a ser aplicada no valor secondário                     |
