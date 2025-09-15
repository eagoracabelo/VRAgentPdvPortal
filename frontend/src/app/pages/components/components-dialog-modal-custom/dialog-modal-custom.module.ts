import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  VrcIconModule,
  VrcInputModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsDialogModalCustomRoutingModule } from './components-dialog-modal-custom-routing.module';
import { ComponentsDialogModalCustomComponent } from './components-dialog-modal-custom.component';
import { ComponentsCustomModalFirstExampleComponent } from './custom-modal-first-example/components-custom-modal-first-example.component';
import { ComponentsCustomModalSecondExampleComponent } from './custom-modal-second-example/components-custom-modal-second-example.component';
import { ComponentsDialogModalCustomExempleComponent } from './dialog-modal-custom-exemple/components-dialog-modal-custom-exemple.component';

@NgModule({
  declarations: [
    ComponentsCustomModalFirstExampleComponent,
    ComponentsCustomModalSecondExampleComponent,
    ComponentsDialogModalCustomExempleComponent,
    ComponentsDialogModalCustomComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsDialogModalCustomRoutingModule,
    VrcIconModule,
    VrcTabsModule,
    VrcInputModule,
    MarkdownModule,
  ],
})
export class ComponentsDialogModalCustomModule {}
