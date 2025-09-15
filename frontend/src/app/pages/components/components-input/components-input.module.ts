import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ElementsFormModule,
  VrcInputModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsInputRoutingModule } from './components-input-routing.module';
import { ComponentsInputComponent } from './components-input.component';

@NgModule({
  declarations: [ComponentsInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsInputRoutingModule,
    MarkdownModule,
    ElementsFormModule,
    VrcInputModule,
    VrcTabsModule,
  ],
})
export class ComponentsInputModule {}
