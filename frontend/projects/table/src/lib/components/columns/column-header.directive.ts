/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[vrc-table-header-template]' })
export class TableColumnHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
