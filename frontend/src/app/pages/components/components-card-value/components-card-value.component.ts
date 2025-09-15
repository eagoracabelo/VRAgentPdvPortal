import { Component } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-card-value',
  templateUrl: './components-card-value.component.html',
  styleUrls: ['./components-card-value.component.scss'],
})
export class ComponentsCardValueComponent extends MarkdownCommon {
  value = 0;

  tooltip = {
    width: 20,
    message: 'Teste tooltip',
    small: true,
    topRight: true,
  };

  constructor() {
    super();
  }
}
