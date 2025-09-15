/* eslint-disable */
import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[vrc-datatable-tree-toggle]' })
export class DataTableColumnCellTreeToggle {
  constructor(public template: TemplateRef<any>) {}
}
