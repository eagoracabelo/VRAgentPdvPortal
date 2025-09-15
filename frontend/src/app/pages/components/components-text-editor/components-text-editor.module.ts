import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrcTabsModule, VrcTextEditorModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsTextEditorRoutingModule } from './components-text-editor-routing.module';
import { ComponentsTextEditorComponent } from './components-text-editor.component';

@NgModule({
  declarations: [ComponentsTextEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsTextEditorRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcTextEditorModule,
  ],
})
export class ComponentsTextEditorModule {}
