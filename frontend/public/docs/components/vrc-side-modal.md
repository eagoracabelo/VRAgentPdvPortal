# VR Side Modal

### Como usar o componente `VrcSideModalComponent` :

Para usar o vr side modal precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcSideModalComponent } from 'vrc-components';

@NgModule({
  imports: [VrcSideModalComponent],
})
export class MyModule {}
```

template:

```html
<vrc-side-modal title="Informações Adicionais">
  <span> conteudo interno </span>
</vrc-side-modal>
```

## Propriedades

Propriedades _@Input()_

|        |                                         |
| ------ | --------------------------------------- |
| title  | define o titulo, por default é ''       |
| height | define a altura, por default é '45vh'   |
| top    | define a posição, por default é 'unset' |
| width  | define o tamanho, por default é '30vw'  |
