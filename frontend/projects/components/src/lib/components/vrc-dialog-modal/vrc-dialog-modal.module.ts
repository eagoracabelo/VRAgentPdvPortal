import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { VrcDialogModalComponent } from './vrc-dialog-modal.component';

const exports = [VrcDialogModalComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [CommonModule, VrCommonModule, VrcIconModule],
})
export class VrcDialogModalModule {}
