import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcTooltipModule } from '../vrc-tooltip';
import { VrcErrorMsgComponent } from './vrc-error-msg.component';

@NgModule({
  declarations: [VrcErrorMsgComponent],
  exports: [VrcErrorMsgComponent],
  imports: [CommonModule, VrcTooltipModule],
})
export class VrcErrorMsgModule {}
