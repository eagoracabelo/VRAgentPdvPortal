import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VrcOptionComponent } from './vrc-option.component';
import { VrCommonModule } from '../../vr-common.module';

const exports = [VrcOptionComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [CommonModule, VrCommonModule],
})
export class VrcOptionModule {}
