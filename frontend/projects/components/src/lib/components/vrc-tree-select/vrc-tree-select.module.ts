import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrcTooltipModule } from '../vrc-tooltip/vrc-tooltip.module';
import { OffClickDirective } from './directives/off-click.directive';
import { ItemPipe } from './pipes/item.pipe';
import { TreeSelectItemComponent } from './vrc-tree-select-item/tree-select-item.component';
import { VrcTreeSelectComponent } from './vrc-tree-select.component';

@NgModule({
  declarations: [
    VrcTreeSelectComponent,
    TreeSelectItemComponent,
    OffClickDirective,
    ItemPipe,
  ],
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    VrcTooltipModule,
    ReactiveFormsModule,
    VrcErrorMsgModule,
  ],
  exports: [VrcTreeSelectComponent],
})
export class VrcTreeSelectModule {}
