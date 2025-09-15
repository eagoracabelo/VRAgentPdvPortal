import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { VrcSelectModule } from '../vrc-select';
import { VrcNavMenuComponent } from './vrc-nav-menu.component';

@NgModule({
  declarations: [VrcNavMenuComponent],
  exports: [VrcNavMenuComponent],
  imports: [CommonModule, VrCommonModule, VrcIconModule, VrcSelectModule],
})
export class VrcNavMenuModule {}
