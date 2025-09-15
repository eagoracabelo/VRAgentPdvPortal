import { Component } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-nav-toolbar',
  templateUrl: './components-nav-toolbar.component.html',
  styleUrls: ['./components-nav-toolbar.component.scss'],
})
export class ComponentsNavToolbarComponent extends MarkdownCommon {
  isExample = false;

  alignCard(e: unknown): void {
    if (e === 'Exemplo') {
      this.isExample = true;
    } else {
      this.isExample = false;
    }
  }
}
