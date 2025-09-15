import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrCommonModule } from '../../vr-common.module';
import { IconStyleDirective } from './directives/icon-style.directive';
import { VrcIconComponent } from './vrc-icon.component';

const exports = [VrcIconComponent, IconStyleDirective];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [CommonModule, VrCommonModule],
})
export class VrcIconModule {}
