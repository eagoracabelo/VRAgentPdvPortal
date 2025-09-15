import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsTabsRoutingModule } from './components-tabs-routing.module';
import { ComponentsTabsComponent } from './components-tabs.component';

@NgModule({
  declarations: [ComponentsTabsComponent],
  imports: [
    CommonModule,
    ComponentsTabsRoutingModule,
    VrcTabsModule,
    MarkdownModule,
  ],
})
export class ComponentsTabsModule {}
