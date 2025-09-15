import { ITreeSelect } from '../interfaces/tree-select.interface';
import { TreeSelectService } from '../services/tree-select.service';
import { SelectableItem } from './selectable-item';

describe('SelectableItem', () => {
  let selectableItem!: SelectableItem;
  let selectService!: TreeSelectService;

  const treeSelect: ITreeSelect = {
    value: 1,
    label: 'item',
    children: [],
    level: 2,
  };

  beforeEach(() => {
    selectService = new TreeSelectService();
    selectableItem = new SelectableItem(1, 'item', treeSelect, 2);
  });

  it('should be truthy', () => {
    expect(selectableItem).toBeTruthy();
  });

  it('should have constructed values', () => {
    expect(selectableItem.id).toEqual(1);
    expect(selectableItem.text).toEqual('item');
    expect(selectableItem.data).toEqual(treeSelect);
    expect(selectableItem.hasChild).toEqual(false);
    expect(selectableItem.level).toEqual(2);
  });

  it('should return true if isSelected is true and set all children to selected', () => {
    const children: ITreeSelect[] = [
      {
        value: 2,
        label: 'item 2',
        children: [],
      },
      {
        value: 3,
        label: 'item 3',
        children: [],
      },
    ];

    const selectable: SelectableItem[] = [
      new SelectableItem(2, 'item 2', children[0], 1),
      new SelectableItem(3, 'item 3', children[1], 2),
    ];
    selectable[0].isSelected = false;
    selectable[1].isSelected = false;

    selectService.options.allowMultiple = false;
    selectableItem.children = selectable;
    selectableItem.setSelected(selectableItem, true, 0);

    expect(selectableItem.children[0].isSelected).toEqual(true);
    expect(selectableItem.children[1].isSelected).toEqual(true);
    expect(selectableItem.isSelected).toEqual(true);
  });

  it('should return true all children are unselected', () => {
    const children: ITreeSelect[] = [
      {
        value: 2,
        label: 'item 2',
        children: [],
      },
      {
        value: 3,
        label: 'item 3',
        children: [],
      },
    ];

    const selectable: SelectableItem[] = [
      new SelectableItem(2, 'item 2', children[0], 1),
      new SelectableItem(3, 'item 3', children[1], 2),
    ];
    selectable[0].isSelected = false;
    selectable[1].isSelected = false;

    selectableItem.children = selectable;

    expect(selectableItem.haveAllChildrenUnselected()).toEqual(true);
  });

  it('should return true if some children are unselected', () => {
    const children: ITreeSelect[] = [
      {
        value: 2,
        label: 'item 2',
        children: [],
      },
      {
        value: 3,
        label: 'item 3',
        children: [],
      },
    ];

    const selectable: SelectableItem[] = [
      new SelectableItem(2, 'item 2', children[0], 1),
      new SelectableItem(3, 'item 3', children[1], 2),
    ];
    selectable[0].isSelected = true;
    selectable[1].isSelected = false;

    selectableItem.children = selectable;

    expect(selectableItem.haveSomeChildrenUnselected()).toEqual(true);
  });

  it('should return true if all children are selected', () => {
    const children: ITreeSelect[] = [
      {
        value: 2,
        label: 'item 2',
        children: [],
      },
      {
        value: 3,
        label: 'item 3',
        children: [],
      },
    ];

    const selectable: SelectableItem[] = [
      new SelectableItem(2, 'item 2', children[0], 0),
      new SelectableItem(3, 'item 3', children[1], 0),
    ];
    selectable[0].isSelected = true;
    selectable[1].isSelected = true;

    selectableItem.children = selectable;

    expect(selectableItem.haveAllChildrenSelected()).toEqual(true);
  });
});
