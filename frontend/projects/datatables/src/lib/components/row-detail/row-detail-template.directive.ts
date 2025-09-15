/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vrc-datatable-row-detail-template]',
})
export class DatatableRowDetailTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
