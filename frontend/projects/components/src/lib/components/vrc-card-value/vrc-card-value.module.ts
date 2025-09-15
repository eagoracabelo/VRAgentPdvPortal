import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';

import { CommonModule } from '@angular/common';
import { VrCommonModule } from '../../vr-common.module';
import { VrcTooltipModule } from '../vrc-tooltip';
import { VrcCardValueComponent } from './vrc-card-value.component';

const exports = [VrcCardValueComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [
    VrCommonModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    VrcTooltipModule,
    CommonModule,
  ],
})
export class VrcCardValueModule {}
