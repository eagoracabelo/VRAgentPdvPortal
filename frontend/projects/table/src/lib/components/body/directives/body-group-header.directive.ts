/* eslint-disable */
import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

import { TableGroupHeaderTemplateDirective } from '../directives/body-group-header-template.directive';

@Directive({ selector: 'vrc-table-group-header' })
export class TableGroupHeaderDirective {
  /**
   * Row height is required when virtual scroll is enabled.
   */
  @Input() rowHeight: number | ((group?: any, index?: number) => number) = 0;

  @Input('template')
  _templateInput!: TemplateRef<any>;

  @ContentChild(TableGroupHeaderTemplateDirective, {
    read: TemplateRef,
    static: true,
  })
  _templateQuery!: TemplateRef<any>;

  get template(): TemplateRef<any> {
    return this._templateInput || this._templateQuery;
  }
}
