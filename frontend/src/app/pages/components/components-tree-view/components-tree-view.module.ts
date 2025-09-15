import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrcTabsModule, VrcTreeViewModule } from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsTreeViewRoutingModule } from './components-tree-view-routing.module';
import { ComponentsTreeViewComponent } from './components-tree-view.component';

@NgModule({
  declarations: [ComponentsTreeViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsTreeViewRoutingModule,
    VrcTabsModule,
    VrcTreeViewModule,
    MarkdownModule,
  ],
})
export class ComponentsTreeViewModule {}
