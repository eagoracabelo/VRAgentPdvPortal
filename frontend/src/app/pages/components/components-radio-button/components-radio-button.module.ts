import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ElementsFormModule,
  VrcRadioModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsRadioButtonRoutingModule } from './components-radio-button-routing.module';
import { ComponentsRadioButtonComponent } from './components-radio-button.component';

@NgModule({
  declarations: [ComponentsRadioButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsRadioButtonRoutingModule,
    ElementsFormModule,
    MarkdownModule,
    VrcTabsModule,
    VrcRadioModule,
  ],
})
export class ComponentsRadioButtonModule {}
