import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewSelectableItem } from '../models/tree-view-selectable-item';
import { ItemPipe } from './item.pipe';

describe('ItemPipe', () => {
  it('should find selectableItem with mathFilter setted to true', () => {
    const treeView: ITreeView = {
      value: 1,
      label: 'item',
      children: [],
    };
    const selectableItem = new TreeViewSelectableItem(1, 'item', treeView);
    selectableItem.matchFilter = true;

    const itemPipe = new ItemPipe();
    const finded = itemPipe.transform([selectableItem]);
    expect(finded).toEqual([selectableItem]);
  });

  it('should NOT find any selectableItem with mathFilter setted to true', () => {
    const treeView: ITreeView = {
      value: 1,
      label: 'item',
      children: [],
    };
    const selectableItem = new TreeViewSelectableItem(1, 'item', treeView);
    selectableItem.matchFilter = false;

    const itemPipe = new ItemPipe();
    const finded = itemPipe.transform([selectableItem]);
    expect(finded).toEqual([]);
  });
});
