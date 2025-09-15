import { Pipe, PipeTransform } from '@angular/core';

import { SelectableItem } from '../models/selectable-item';

@Pipe({ name: 'itemPipe' })
export class ItemPipe implements PipeTransform {
  transform(value: SelectableItem[]): SelectableItem[] {
    return value.filter((item) => item.matchFilter);
  }
}
