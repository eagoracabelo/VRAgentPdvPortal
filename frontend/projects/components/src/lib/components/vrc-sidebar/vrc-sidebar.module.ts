import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { MenuBreakDirective } from './directives/menu-break.directive';
import { VrcSidebarComponent } from './vrc-sidebar.component';

@NgModule({
  declarations: [VrcSidebarComponent, MenuBreakDirective],
  exports: [VrcSidebarComponent],
  imports: [CommonModule, VrCommonModule, RouterModule, VrcIconModule],
})
export class VrcSidebarModule {}
