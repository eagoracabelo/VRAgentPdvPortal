/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vrc-table-row-detail-template]',
})
export class TableRowDetailTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
