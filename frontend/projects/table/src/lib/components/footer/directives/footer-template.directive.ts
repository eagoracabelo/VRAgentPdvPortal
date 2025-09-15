/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[vrc-table-footer-template]' })
export class TableFooterTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
