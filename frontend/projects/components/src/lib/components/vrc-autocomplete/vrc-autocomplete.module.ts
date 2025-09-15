import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrcOptionModule } from '../vrc-option';
import { VrcTooltipModule } from '../vrc-tooltip/vrc-tooltip.module';
import { VrcAutocompleteComponent } from './vrc-autocomplete.component';

const exports = [VrcAutocompleteComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    VrcOptionModule,
    ReactiveFormsModule,
    VrcTooltipModule,
    VrcErrorMsgModule,
  ],
})
export class VrcAutocompleteModule {}
