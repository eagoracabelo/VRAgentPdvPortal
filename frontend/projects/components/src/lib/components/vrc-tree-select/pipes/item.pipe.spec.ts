import { ITreeSelect } from '../interfaces/tree-select.interface';
import { SelectableItem } from '../models/selectable-item';
import { ItemPipe } from './item.pipe';

describe('ItemPipe', () => {
  it('should find selectableItem with mathFilter setted to true', () => {
    const treeSelect: ITreeSelect = {
      value: 1,
      label: 'item',
      children: [],
    };
    const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);
    selectableItem.matchFilter = true;

    const itemPipe = new ItemPipe();
    const finded = itemPipe.transform([selectableItem]);
    expect(finded).toEqual([selectableItem]);
  });

  it('should NOT find any selectableItem with mathFilter setted to true', () => {
    const treeSelect: ITreeSelect = {
      value: 1,
      label: 'item',
      children: [],
    };
    const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);
    selectableItem.matchFilter = false;

    const itemPipe = new ItemPipe();
    const finded = itemPipe.transform([selectableItem]);
    expect(finded).toEqual([]);
  });
});
