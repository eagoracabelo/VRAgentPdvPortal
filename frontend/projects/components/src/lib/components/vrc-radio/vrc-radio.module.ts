import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';

import { VrcTooltipModule } from '../vrc-tooltip';
import { VrcRadioButtonComponent } from './vrc-radio-button/vrc-radio-button.component';
import { VrcRadioGroupComponent } from './vrc-radio-group/vrc-radio-group.component';

const exports = [VrcRadioGroupComponent, VrcRadioButtonComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    ReactiveFormsModule,
    VrcTooltipModule,
  ],
})
export class VrcRadioModule {}
