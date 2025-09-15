/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

import { TableFooterTemplateDirective } from './footer-template.directive';

@Directive({ selector: 'vrc-table-footer' })
export class TableFooterDirective {
  @Input() footerHeight!: number;
  @Input() totalMessage!: string;
  @Input() selectedMessage!: string | boolean;

  @Input('template')
  _templateInput!: TemplateRef<any>;

  @ContentChild(TableFooterTemplateDirective, { read: TemplateRef })
  _templateQuery!: TemplateRef<any>;

  get template(): TemplateRef<any> {
    return this._templateInput || this._templateQuery;
  }
}
