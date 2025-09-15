import { Component } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-tooltip',
  templateUrl: './components-tooltip.component.html',
  styleUrls: ['./components-tooltip.component.scss'],
})
export class ComponentsTooltipComponent extends MarkdownCommon {
  constructor() {
    super();
  }
}
