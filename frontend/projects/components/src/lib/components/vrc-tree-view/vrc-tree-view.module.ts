import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ItemPipe } from './pipes/item.pipe';
import { TreeViewItemComponent } from './tree-view-item/tree-view-item.component';
import { VrcTreeViewComponent } from './vrc-tree-view.component';

@NgModule({
  declarations: [VrcTreeViewComponent, TreeViewItemComponent, ItemPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [VrcTreeViewComponent],
})
export class VrcTreeViewModule {}
