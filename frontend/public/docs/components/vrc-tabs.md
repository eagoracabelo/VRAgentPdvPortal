# VR Tabs

### Como usar o componente `VrcTabsComponent` :

Para usar o vr tabs precisa importar o seu modulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from "@angular/core";

import { VrcTabsModule } from "vrc-components";

@NgModule({
  imports: [VrcTabsModule],
})
export class MyModule {}
```

template:

```html
<vrc-tabs>
  <vrc-tab label="Primeiro"><div class="col-sm-12">Tab 01</div></vrc-tab>
  <vrc-tab label="Segundo"><div class="col-sm-12">Tab 02</div></vrc-tab>
  <vrc-tab label="Terceiro"><div class="col-sm-12">Tab 03</div></vrc-tab>
</vrc-tabs>
```

## Propriedades

Propriedade _@Output()_

|             |                                    |
| ----------- | ---------------------------------- |
| selected    | obtém o valor selecionado no click |
| styleButton | altera stilo do botão de seleção   |

### Exemplo

```typescript
import { Component } from "@angular/core";
("@angular/forms");

@Component({
  selector: "vr-my",
  template: `
    <vrc-tabs (selected)="onSelected($event)">
      <vrc-tab label="Primeiro"><div class="col-sm-12">Tab 01</div></vrc-tab>
      <vrc-tab label="Segundo"><div class="col-sm-12">Tab 02</div></vrc-tab>
      <vrc-tab label="Terceiro"><div class="col-sm-12">Tab 03</div></vrc-tab>
    </vrc-tabs>
  `,
})
export class MyComponent {
  selected!: string;
  onSelected(selected: string): void {
    this.selected = selected;
  }
}
```
