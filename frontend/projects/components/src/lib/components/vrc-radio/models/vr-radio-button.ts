import { Directive, Input } from '@angular/core';

@Directive()
export abstract class VrRadioButton {
  @Input() value!: unknown;
  @Input() disabled = false;
  content?: unknown;
}
