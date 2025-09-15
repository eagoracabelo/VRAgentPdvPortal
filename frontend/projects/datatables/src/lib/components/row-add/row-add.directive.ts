/* eslint-disable */
import { ContentChild, Directive, TemplateRef } from '@angular/core';

import { DatatableRowAddTemplateDirective } from './row-add-template.directive';

@Directive({ selector: 'vrc-datatable-row-add' })
export class DatatableRowAddDirective {
  @ContentChild(DatatableRowAddTemplateDirective, {
    read: TemplateRef,
    static: true,
  })
  templateAddQuery!: TemplateRef<any>;
}
