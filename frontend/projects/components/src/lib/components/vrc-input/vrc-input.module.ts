import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';
import { VrcInputComponent } from './vrc-input.component';

import { IMaskModule } from 'angular-imask';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrcTooltipModule } from '../vrc-tooltip/vrc-tooltip.module';

const exports = [VrcInputComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    IMaskModule,
    VrcTooltipModule,
    ReactiveFormsModule,
    VrcErrorMsgModule,
  ],
})
export class VrcInputModule {}
