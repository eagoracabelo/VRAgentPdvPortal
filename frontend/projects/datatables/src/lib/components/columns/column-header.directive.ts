/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[vrc-datatable-header-template]' })
export class DataTableColumnHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
