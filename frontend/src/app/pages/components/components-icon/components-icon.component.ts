import { Component, ViewEncapsulation } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-icon',
  templateUrl: './components-icon.component.html',
  styleUrls: ['./components-icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComponentsIconComponent extends MarkdownCommon {}
