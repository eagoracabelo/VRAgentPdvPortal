import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcTabsModule, VrcTooltipModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsTooltipRoutingModule } from './components-tooltip-routing.module';
import { ComponentsTooltipComponent } from './components-tooltip.component';

@NgModule({
  declarations: [ComponentsTooltipComponent],
  imports: [
    CommonModule,
    ComponentsTooltipRoutingModule,
    VrcTooltipModule,
    VrcTabsModule,
    MarkdownModule,
  ],
})
export class ComponentsTooltipModule {}
