/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[vrc-table-cell-template]' })
export class TableColumnCellDirective {
  constructor(public template: TemplateRef<any>) {}
}
