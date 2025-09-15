import { Pipe, PipeTransform } from '@angular/core';

import { TreeViewSelectableItem } from '../models/tree-view-selectable-item';

@Pipe({ name: 'itemPipe' })
export class ItemPipe implements PipeTransform {
  transform(value: TreeViewSelectableItem[]): TreeViewSelectableItem[] {
    return value.filter((item) => item.matchFilter);
  }
}
