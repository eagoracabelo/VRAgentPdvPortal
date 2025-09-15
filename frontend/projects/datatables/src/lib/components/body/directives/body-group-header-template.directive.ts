/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[vrc-datatable-group-header-template]',
})
export class DatatableGroupHeaderTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
