import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcIconModule, VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsIconRoutingModule } from './components-icon-routing.module';
import { ComponentsIconComponent } from './components-icon.component';

@NgModule({
  declarations: [ComponentsIconComponent],
  imports: [
    CommonModule,
    ComponentsIconRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcIconModule,
  ],
})
export class ComponentsIconModule {}
