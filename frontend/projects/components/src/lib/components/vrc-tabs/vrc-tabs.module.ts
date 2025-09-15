import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { VrcTabComponent } from './vrc-tab/vrc-tab.component';
import { VrcTabsComponent } from './vrc-tabs/vrc-tabs.component';

const exports = [VrcTabsComponent, VrcTabComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [CommonModule, VrCommonModule, VrcIconModule],
})
export class VrcTabsModule {}
