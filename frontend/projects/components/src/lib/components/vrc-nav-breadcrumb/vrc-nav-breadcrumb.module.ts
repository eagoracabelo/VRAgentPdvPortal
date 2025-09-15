import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VrCommonModule } from '../../vr-common.module';
import { VrcNavBreadcrumbComponent } from './vrc-nav-breadcrumb.component';

@NgModule({
  declarations: [VrcNavBreadcrumbComponent],
  exports: [VrcNavBreadcrumbComponent],
  imports: [CommonModule, VrCommonModule, RouterModule],
})
export class VrcNavBreadcrumbModule {}
