import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VruiRoutingModule } from './vrui-routing.module';
import { VruiComponent } from './vrui.component';

@NgModule({
  declarations: [VruiComponent],
  imports: [CommonModule, VruiRoutingModule],
})
export class VruiModule {}
