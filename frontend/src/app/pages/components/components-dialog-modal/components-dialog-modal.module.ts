import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsDialogModalRoutingModule } from './components-dialog-modal-routing.module';
import { ComponentsDialogModalComponent } from './components-dialog-modal.component';

@NgModule({
  declarations: [ComponentsDialogModalComponent],
  imports: [
    CommonModule,
    ComponentsDialogModalRoutingModule,
    VrcTabsModule,
    MarkdownModule,
  ],
})
export class ComponentsDialogModalModule {}
