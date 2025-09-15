import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VrcSlideToggleComponent } from './vrc-slide-toggle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';

const exports = [VrcSlideToggleComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [CommonModule, VrCommonModule, FormsModule, ReactiveFormsModule],
})
export class VrcSlideToggleModule {}
