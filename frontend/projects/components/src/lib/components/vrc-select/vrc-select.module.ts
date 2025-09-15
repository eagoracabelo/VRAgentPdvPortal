import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OverlayModule } from '@angular/cdk/overlay';
import { IMaskModule } from 'angular-imask';
import { VrCommonModule } from '../../vr-common.module';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrcIconModule } from '../vrc-icon/vrc-icon.module';
import { VrcTooltipModule } from '../vrc-tooltip/vrc-tooltip.module';
import { VrcSelectHintDirective } from './vrc-select-hint.directive';
import { VrcSelectLabelDirective } from './vrc-select-label.directive';
import { VrcSelectComponent } from './vrc-select.component';

@NgModule({
  declarations: [
    VrcSelectComponent,
    VrcSelectHintDirective,
    VrcSelectLabelDirective,
  ],
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    ReactiveFormsModule,
    VrcTooltipModule,
    VrcIconModule,
    VrcErrorMsgModule,
    OverlayModule,
    IMaskModule,
  ],
  exports: [
    VrcSelectHintDirective,
    VrcSelectComponent,
    VrcSelectLabelDirective,
  ],
})
export class VrcSelectModule {}
