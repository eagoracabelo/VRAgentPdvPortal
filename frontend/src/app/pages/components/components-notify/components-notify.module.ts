import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsNotifyRoutingModule } from './components-notify-routing.module';
import { ComponentsNotifyComponent } from './components-notify.component';

@NgModule({
  declarations: [ComponentsNotifyComponent],
  imports: [
    CommonModule,
    ComponentsNotifyRoutingModule,
    VrcTabsModule,
    MarkdownModule,
  ],
})
export class ComponentsNotifyModule {}
