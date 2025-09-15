/* eslint-disable */
import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

import { TableRowDetailTemplateDirective } from './row-detail-template.directive';

@Directive({ selector: 'vrc-table-row-detail' })
export class TableRowDetailDirective {
  /**
   * The detail row height is required especially
   * when virtual scroll is enabled.
   */
  @Input() rowHeight: number | ((row?: any, index?: number) => number) = 0;

  @Input('template')
  _templateInput!: TemplateRef<any>;

  @ContentChild(TableRowDetailTemplateDirective, {
    read: TemplateRef,
    static: true,
  })
  _templateQuery!: TemplateRef<any>;

  get template(): TemplateRef<any> {
    return this._templateInput || this._templateQuery;
  }
}
