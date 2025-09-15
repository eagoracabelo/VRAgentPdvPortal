import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcNavToolbarModule, VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsNavToolbarRoutingModule } from './components-nav-toolbar-routing.module';
import { ComponentsNavToolbarComponent } from './components-nav-toolbar.component';

@NgModule({
  declarations: [ComponentsNavToolbarComponent],
  imports: [
    CommonModule,
    ComponentsNavToolbarRoutingModule,
    VrcTabsModule,
    VrcNavToolbarModule,
    MarkdownModule,
  ],
})
export class ComponentsNavToolbarModule {}
