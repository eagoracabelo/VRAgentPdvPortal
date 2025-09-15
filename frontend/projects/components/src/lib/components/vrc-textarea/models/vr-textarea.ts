import { Input, Directive } from '@angular/core';

import { VrInputField } from '../../../shared/vr-element-field/vr-input-field';

@Directive()
export abstract class VrTextarea extends VrInputField {
  @Input() maxlength!: number | string;
  @Input() minlength!: number | string;
  @Input() rows!: number | string;
  @Input() spellcheck = 'false';
  @Input() wrap = 'soft';

  constructor() {
    super();
  }
}
