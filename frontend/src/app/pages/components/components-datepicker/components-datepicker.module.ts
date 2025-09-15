import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ElementsFormModule,
  VrcDatepickerModule,
  VrcInputModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsDatepickerRoutingModule } from './components-datepicker-routing.module';
import { ComponentsDatepickerComponent } from './components-datepicker.component';

@NgModule({
  declarations: [ComponentsDatepickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsDatepickerRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcDatepickerModule,
    VrcInputModule,
    ElementsFormModule,
  ],
})
export class ComponentsDatepickerModule {}
