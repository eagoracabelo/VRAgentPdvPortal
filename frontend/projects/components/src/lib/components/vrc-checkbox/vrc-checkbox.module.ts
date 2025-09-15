import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';

import { VrcCheckboxComponent } from './vrc-checkbox.component';

const exports = [VrcCheckboxComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [CommonModule, VrCommonModule, FormsModule, ReactiveFormsModule],
})
export class VrcCheckboxModule {}
