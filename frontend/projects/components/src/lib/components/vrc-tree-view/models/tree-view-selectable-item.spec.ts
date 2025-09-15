import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewService } from '../services/tree-view.service';
import { TreeViewCheckboxMode } from './tree-view-checkbox-model';
import { TreeViewSelectableItem } from './tree-view-selectable-item';

describe('TreeViewSelectableItem', () => {
  let selectableItem!: TreeViewSelectableItem;
  let selectService!: TreeViewService;

  const treeSelect: ITreeView = {
    value: 1,
    label: 'item',
    children: [],
  };

  beforeEach(() => {
    selectService = new TreeViewService();
    selectableItem = new TreeViewSelectableItem(1, 'item', treeSelect);
  });

  it('should be truthy', () => {
    expect(selectableItem).toBeTruthy();
  });

  it('should have constructed values', () => {
    expect(selectableItem.id).toEqual(1);
    expect(selectableItem.text).toEqual('item');
    expect(selectableItem.data).toEqual(treeSelect);
    expect(selectableItem.hasChild).toEqual(false);
  });

  it('should return true if isSelected is true and set all children to selected', () => {
    const children: ITreeView[] = [
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

    const selectable: TreeViewSelectableItem[] = [
      new TreeViewSelectableItem(2, 'item 2', children[0]),
      new TreeViewSelectableItem(3, 'item 3', children[1]),
    ];
    selectable[0].selectionMode = TreeViewCheckboxMode.None;
    selectable[1].selectionMode = TreeViewCheckboxMode.None;

    selectService.options.allowMultiple = false;
    selectableItem.children = selectable;
    selectableItem.setSelected(selectableItem, TreeViewCheckboxMode.Check);

    expect(selectableItem.children[0].selectionMode).toEqual(
      TreeViewCheckboxMode.Check,
    );
    expect(selectableItem.children[1].selectionMode).toEqual(
      TreeViewCheckboxMode.Check,
    );
    expect(selectableItem.selectionMode).toEqual(TreeViewCheckboxMode.Check);
  });

  it('should return true all children are unselected', () => {
    const children: ITreeView[] = [
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

    const selectable: TreeViewSelectableItem[] = [
      new TreeViewSelectableItem(2, 'item 2', children[0]),
      new TreeViewSelectableItem(3, 'item 3', children[1]),
    ];
    selectable[0].selectionMode = TreeViewCheckboxMode.None;
    selectable[1].selectionMode = TreeViewCheckboxMode.None;

    selectableItem.children = selectable;

    expect(selectableItem.haveAllChildrenUnselected()).toEqual(true);
  });

  it('should return true if some children are unselected', () => {
    const children: ITreeView[] = [
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

    const selectable: TreeViewSelectableItem[] = [
      new TreeViewSelectableItem(2, 'item 2', children[0]),
      new TreeViewSelectableItem(3, 'item 3', children[1]),
    ];
    selectable[0].selectionMode = TreeViewCheckboxMode.Check;
    selectable[1].selectionMode = TreeViewCheckboxMode.None;

    selectableItem.children = selectable;

    expect(selectableItem.haveSomeChildrenUnselected()).toEqual(true);
  });

  it('should return true if all children are selected', () => {
    const children: ITreeView[] = [
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

    const selectable: TreeViewSelectableItem[] = [
      new TreeViewSelectableItem(2, 'item 2', children[0]),
      new TreeViewSelectableItem(3, 'item 3', children[1]),
    ];
    selectable[0].selectionMode = TreeViewCheckboxMode.Check;
    selectable[1].selectionMode = TreeViewCheckboxMode.Check;

    selectableItem.children = selectable;

    expect(selectableItem.haveAllChildrenSelected()).toEqual(true);
  });
});
