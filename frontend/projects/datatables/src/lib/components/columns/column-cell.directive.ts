/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[vrc-datatable-cell-template]' })
export class DataTableColumnCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
