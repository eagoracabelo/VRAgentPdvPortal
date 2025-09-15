/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vrc-datatable-row-add-template]',
})
export class DatatableRowAddTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
