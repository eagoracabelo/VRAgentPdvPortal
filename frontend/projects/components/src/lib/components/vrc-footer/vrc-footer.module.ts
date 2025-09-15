import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VrcFooterComponent } from './vrc-footer.component';

@NgModule({
  declarations: [VrcFooterComponent],
  exports: [VrcFooterComponent],
  imports: [CommonModule],
})
export class VrcFooterModule {}
