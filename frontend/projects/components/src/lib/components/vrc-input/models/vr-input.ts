import { Directive, Input } from '@angular/core';
import { VrInputField } from '../../../shared/vr-element-field/vr-input-field';

@Directive()
export abstract class VrInput extends VrInputField {
  @Input() type = 'text';
  @Input() mask!: Record<string, unknown>;
  @Input() unmasked: 'typed' | boolean = true;
}
