import { VrElementField } from '../../../shared/vr-element-field/vr-element-field';
import { ContentChildren, QueryList, Directive } from '@angular/core';

import { VrcRadioButtonComponent } from '../vrc-radio-button/vrc-radio-button.component';

@Directive()
export abstract class VrRadioGroup extends VrElementField {
  @ContentChildren(VrcRadioButtonComponent)
  options!: QueryList<VrcRadioButtonComponent>;
}
