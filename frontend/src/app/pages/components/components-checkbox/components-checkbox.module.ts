import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ElementsFormModule,
  VrcCheckboxModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsCheckboxRoutingModule } from './components-checkbox-routing.module';
import { ComponentsCheckboxComponent } from './components-checkbox.component';

@NgModule({
  declarations: [ComponentsCheckboxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsCheckboxRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcCheckboxModule,
    ElementsFormModule,
  ],
})
export class ComponentsCheckboxModule {}
