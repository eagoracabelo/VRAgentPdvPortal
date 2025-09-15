import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  VrcInputModule,
  VrcSelectModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsSelectRoutingModule } from './components-select-routing.module';
import { ComponentsSelectComponent } from './components-select.component';

@NgModule({
  declarations: [ComponentsSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsSelectRoutingModule,
    VrcTabsModule,
    VrcSelectModule,
    VrcInputModule,
    MarkdownModule,
  ],
})
export class ComponentsSelectModule {}
