import { Component } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-side-modal',
  templateUrl: './components-side-modal.component.html',
  styleUrls: ['./components-side-modal.component.scss'],
})
export class ComponentsSideModalComponent extends MarkdownCommon {
  constructor() {
    super();
  }
}
