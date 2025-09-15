import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VrcNavToolbarComponent } from './vrc-nav-toolbar.component';

@NgModule({
  declarations: [VrcNavToolbarComponent],
  exports: [VrcNavToolbarComponent],
  imports: [CommonModule],
})
export class VrcNavToolbarModule {}
