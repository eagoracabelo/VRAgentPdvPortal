import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';

import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { VrCommonModule } from '../../vr-common.module';
import { VrcSideModalComponent } from './vrc-side-modal.component';

const exports = [VrcSideModalComponent];

@NgModule({
  declarations: [...exports],
  exports,
  imports: [
    VrCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    CdkDrag,
    CdkDragHandle,
  ],
})
export class VrcSideModalModule {}
