/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vrc-table-group-header-template]',
})
export class TableGroupHeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
