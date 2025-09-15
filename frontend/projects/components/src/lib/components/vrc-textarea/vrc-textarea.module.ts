import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrcTextareaComponent } from './vrc-textarea.component';

import { VrCommonModule } from '../../vr-common.module';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrcTooltipModule } from '../vrc-tooltip/vrc-tooltip.module';

const exports = [VrcTextareaComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    ReactiveFormsModule,
    VrcTooltipModule,
    VrcErrorMsgModule,
  ],
})
export class VrcTextareaModule {}
