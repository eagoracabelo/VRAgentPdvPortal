import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VrcIconModule } from '../vrc-icon';
import { VrcNavSuporteComponent } from './vrc-nav-support.component';

@NgModule({
  declarations: [VrcNavSuporteComponent],
  exports: [VrcNavSuporteComponent],
  imports: [CommonModule, VrcIconModule],
})
export class VrcNavSuporteModule {}
