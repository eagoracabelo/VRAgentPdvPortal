import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcSideModalModule, VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsSideModalRoutingModule } from './components-side-modal-routing.module';
import { ComponentsSideModalComponent } from './components-side-modal.component';

@NgModule({
  declarations: [ComponentsSideModalComponent],
  imports: [
    CommonModule,
    ComponentsSideModalRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcSideModalModule,
  ],
})
export class ComponentsSideModalModule {}
