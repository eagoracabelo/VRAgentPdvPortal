import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VrcTabsModule, VrcTextareaModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsTextareaRoutingModule } from './components-textarea-routing.module';
import { ComponentsTextareaComponent } from './components-textarea.component';

@NgModule({
  declarations: [ComponentsTextareaComponent],
  imports: [
    CommonModule,
    ComponentsTextareaRoutingModule,
    VrcTextareaModule,
    VrcTabsModule,
    MarkdownModule,
  ],
})
export class ComponentsTextareaModule {}
