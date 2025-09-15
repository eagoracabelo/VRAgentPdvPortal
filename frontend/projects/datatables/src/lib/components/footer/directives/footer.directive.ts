/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

import { DataTableFooterTemplateDirective } from './footer-template.directive';

@Directive({ selector: 'vrc-datatable-footer' })
export class DatatableFooterDirective {
  @Input() footerHeight!: number;
  @Input() ofMessage!: string | boolean;
  @Input() itemsMessage!: string;
  @Input() itemsPerPageMessage!: string;
  @Input() pagerLeftArrowIcon!: string;
  @Input() pagerRightArrowIcon!: string;
  @Input() pagerPreviousIcon!: string;
  @Input() pagerNextIcon!: string;

  @Input('template')
  _templateInput!: TemplateRef<any>;

  @ContentChild(DataTableFooterTemplateDirective, { read: TemplateRef })
  _templateQuery!: TemplateRef<any>;

  get template(): TemplateRef<any> {
    return this._templateInput || this._templateQuery;
  }
}
