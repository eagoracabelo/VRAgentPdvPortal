import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrcTabsModule, VrcTreeSelectModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsTreeSelectRoutingModule } from './components-tree-select-routing.module';
import { ComponentsTreeSelectComponent } from './components-tree-select.component';

@NgModule({
  declarations: [ComponentsTreeSelectComponent],
  imports: [
    CommonModule,
    ComponentsTreeSelectRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule,
    VrcTabsModule,
    VrcTreeSelectModule,
  ],
})
export class ComponentsTreeSelectModule {}
