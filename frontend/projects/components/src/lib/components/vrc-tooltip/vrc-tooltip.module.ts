import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VrcTooltipComponent } from './vrc-tooltip.component';

@NgModule({
  declarations: [VrcTooltipComponent],
  exports: [VrcTooltipComponent],
  imports: [CommonModule, OverlayModule],
})
export class VrcTooltipModule {}
