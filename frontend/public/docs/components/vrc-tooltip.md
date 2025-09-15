# VR Tooltip

### Como usar o componente `VrcTooltip` :

Para usar o ´vr tooltip´ basta importa-lo no modulo do componente o qual será utilizado e inclui-lo no HTML desse componente, como no exemplo abaixo.

```typescript
import { ExampleComponent } from './example.component';
import { VrcTooltipModule } from '@vrsoftbr/vr-components';

@NgModule({
  declarations: [ExampleComponent],
  imports: [VrcTooltipModule],
})
export class exampleModule {}
```

```typescript
import { Component } from '@angular/core';

@Component({
  template: `<vrc-tooltip></vrc-tooltip>`,
})
export class ExampleComponent {}
```

Após ter configurado o componete 'vrc-tooltip' no componete main, ele já estará funcionando com seus valores default, mas caso queira alterar alguma propriedade, basta passar o valor desejado como no exemplo abaixo:

```html
<vrc-tooltip [message]="'Um teste de mensagem'" [bottomLeft]="true"></vrc-tooltip>
```

## Propriedades (inputs)

Propriedades (inputs) tooltip

|                     |                                                              |
| ------------------- | ------------------------------------------------------------ |
| message / message[] | mensagem(s) a ser(em) exibida(s)                             |
| bottomRight         | Exibe o tooltip na diagonal inferior direita (valor default) |
| bottomLeft          | Exibe o tooltip na diagonal inferior esquerda                |
| topRight            | Exibe o tooltip na diagonal superior direita                 |
| topLeft             | Exibe o tooltip na diagonal superior esquerda                |
| error               | Exibe o tooltip de erro                                      |
| small               | Deixa o tooltip levemente menor                              |
| width               | Define o tamanho do tooltip                                  |
| tooltipOverlay      | Se true usa o CDK para sobrepor os elementos da tela         |
