import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrcCardValueModule, VrcTabsModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsCardValueRoutingModule } from './components-card-value-routing.module';
import { ComponentsCardValueComponent } from './components-card-value.component';

@NgModule({
  declarations: [ComponentsCardValueComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsCardValueRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcCardValueModule,
  ],
})
export class ComponentsCardValueModule {}
