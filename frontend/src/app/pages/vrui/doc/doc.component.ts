import { Component } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-doc',
  templateUrl: './doc.component.html',
  styleUrl: './doc.component.scss',
})
export class DocComponent extends MarkdownCommon {}
