import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewCheckboxMode } from '../models/tree-view-checkbox-model';
import { TreeViewDefaultOptions } from '../models/tree-view-default-options';
import { TreeViewExpandMode } from '../models/tree-view-expand-mode';
import { TreeViewSelectableItem } from '../models/tree-view-selectable-item';
import { TreeViewService } from './tree-view.service';

describe('VrAutocompleteService', () => {
  let service: TreeViewService;
  let treeView: ITreeView[] = [];

  beforeEach(() => {
    service = new TreeViewService();
    service.setOptions(new TreeViewDefaultOptions());
    treeView = [
      {
        value: 1,
        label: 'item 1',
        children: [],
      },
      {
        value: 2,
        label: 'item 2',
        children: [
          {
            value: 20,
            label: 'item 20',
            children: [],
          },
        ],
      },
    ];
    service.setItems(treeView);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('close', () => {
    it('should close if isOpen is true', () => {
      service.setOptions({ isOpen: true });
      service.close();
      expect(service.options.isOpen).toEqual(false);
    });

    it('should NOT close if isOpen is false', () => {
      service.setOptions({ isOpen: false });
      service.close();
      expect(service.options.isOpen).toEqual(false);
    });
  });

  describe('open', () => {
    it('should open if isOpen is false', () => {
      service.setOptions({ isOpen: false });
      service.open();
      expect(service.options.isOpen).toEqual(true);
    });

    it('should NOT open if isOpen is true', () => {
      service.setOptions({ isOpen: true });
      service.open();
      expect(service.options.isOpen).toEqual(true);
    });
  });

  it('should invert isOpen value on toggleOpen', () => {
    service.setOptions({ isOpen: false });
    service.toggleOpen();
    expect(service.options.isOpen).toEqual(true);
  });

  it('should get internal items', () => {
    const selectableWithChildren = new TreeViewSelectableItem(
      2,
      'item 2',
      treeView[1],
    );
    selectableWithChildren.children.push(
      new TreeViewSelectableItem(20, 'item 20', treeView[1].children[0]),
    );

    const items = service.getInternalItems();
    expect(items[0]).toEqual(
      new TreeViewSelectableItem(1, 'item 1', treeView[0]),
    );
    expect(items[1]).toEqual(selectableWithChildren);
  });

  describe('setSelection', () => {
    it('should set selection', () => {
      const newTreeSelect: ITreeView = {
        value: 3,
        label: 'item 3',
        children: [],
      };
      service.setSelection(newTreeSelect);

      expect(service.options.model).toEqual(newTreeSelect);
    });

    it('should set all to unselected when received value is empty', () => {
      service.setSelection(treeView[0]);
      expect(service.getInternalSelection()[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Check,
      );

      service.setSelection(undefined as unknown as ITreeView);

      expect(service.options.model).toEqual(undefined as unknown as ITreeView);
      expect(service.getInternalSelection().length).toEqual(0);
    });
  });

  describe('toggleItemSelection', () => {
    it('should set selectionMode to Check and isOpen to false', () => {
      const newTreeSelect: ITreeView = {
        value: 3,
        label: 'item 3',
        children: [],
      };

      const newTreeSelectChildren: ITreeView[] = [
        {
          value: 30,
          label: 'item 30',
          children: [],
        },
      ];

      const selectableItem: TreeViewSelectableItem = new TreeViewSelectableItem(
        3,
        'item 3',
        newTreeSelect,
      );

      selectableItem.children = [
        new TreeViewSelectableItem(30, 'item 30', newTreeSelectChildren[0]),
      ];

      service.options.allowMultiple = true;
      service.options.closeOnSelection = true;

      service.toggleItemSelection(selectableItem);

      expect(selectableItem.selectionMode).toEqual(TreeViewCheckboxMode.Check);
      expect(selectableItem.children[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Check,
      );
      expect(selectableItem.isOpen).toEqual(false);
    });

    it('should set selectionMode to Check and isOpen should be true', () => {
      const newTreeSelect: ITreeView = {
        value: 3,
        label: 'item 3',
        children: [],
      };

      const newTreeSelectChildren: ITreeView[] = [
        {
          value: 30,
          label: 'item 30',
          children: [],
        },
      ];

      const selectableItem: TreeViewSelectableItem = new TreeViewSelectableItem(
        3,
        'item 3',
        newTreeSelect,
      );

      selectableItem.children = [
        new TreeViewSelectableItem(30, 'item 30', newTreeSelectChildren[0]),
      ];

      service.options.allowMultiple = false;
      service.options.closeOnSelection = false;
      selectableItem.isOpen = true;

      service.toggleItemSelection(selectableItem);

      expect(selectableItem.selectionMode).toEqual(TreeViewCheckboxMode.Check);
      expect(selectableItem.isOpen).toEqual(true);
    });

    it('should set selectionMode to None and isOpen should be false', () => {
      const newTreeSelect: ITreeView = {
        value: 3,
        label: 'item 3',
        children: [],
      };

      const newTreeSelectChildren: ITreeView[] = [
        {
          value: 30,
          label: 'item 30',
          children: [],
        },
      ];

      const selectableItem: TreeViewSelectableItem = new TreeViewSelectableItem(
        3,
        'item 3',
        newTreeSelect,
      );

      selectableItem.children = [
        new TreeViewSelectableItem(30, 'item 30', newTreeSelectChildren[0]),
      ];

      service.options.allowMultiple = false;
      service.options.closeOnSelection = false;
      selectableItem.selectionMode = TreeViewCheckboxMode.Check;

      service.toggleItemSelection(selectableItem);

      expect(selectableItem.selectionMode).toEqual(TreeViewCheckboxMode.None);
      expect(selectableItem.isOpen).toEqual(false);
    });
  });

  describe('getInternalSelection', () => {
    it('should return empty when have no items', () => {
      service.setItems([]);

      const internalSelection = service.getInternalSelection();

      expect(internalSelection.length).toEqual(0);
    });

    it('should getInternalSelection return selected children and set parent selectionMode to Check when all children are selected', () => {
      service.setItems(treeView);
      service.setSelection(treeView[1].children);

      service.options.allowParentSelection = true;

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(2);
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Check,
      );
    });

    it('should getInternalSelection return selected children when all children and parent are selected', () => {
      const newItems = [
        {
          value: 1,
          label: 'item 1',
          children: [
            {
              value: 10,
              label: 'item 10',
              children: [],
            },
          ],
        },
      ];
      service.options.allowParentSelection = true;

      service.setItems(newItems);
      service.setSelection(newItems[0]);
      service.setSelection(newItems[0].children[0]);

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(1);
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Check,
      );
    });

    it('should getInternalSelection return selected children and set parent selectionMode to None when some children are unselected', () => {
      const newItems = [
        {
          value: 1,
          label: 'item 1',
          children: [
            {
              value: 10,
              label: 'item 10',
              children: [],
            },
            {
              value: 11,
              label: 'item 11',
              children: [],
            },
          ],
        },
      ];
      service.options.allowParentSelection = true;

      service.setItems(newItems);
      service.setSelection(newItems[0]);
      service.setSelection(newItems[0].children[0]);

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(1);
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Check,
      );
    });

    it('should getInternalSelection return empty and set parent selectionMode to None when all children are unselected', () => {
      const newItems = [
        {
          value: 1,
          label: 'item 1',
          children: [
            {
              value: 10,
              label: 'item 10',
              children: [],
            },
            {
              value: 11,
              label: 'item 11',
              children: [],
            },
          ],
        },
      ];
      service.options.allowParentSelection = true;

      service.setItems(newItems);
      service.setSelection(newItems[0]);

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(1);
      expect(internalSelection.length).toEqual(0);
    });

    it('should getInternalSelection return selected children and set parent selectionMode to Minus when some children are unselected', () => {
      const newItems = [
        {
          value: 1,
          label: 'item 1',
          children: [
            {
              value: 10,
              label: 'item 10',
              children: [],
            },
            {
              value: 11,
              label: 'item 11',
              children: [],
            },
          ],
        },
      ];
      service.options.allowParentSelection = true;

      service.setItems(newItems);
      service.setSelection(newItems[0].children[0]);

      const internalSelection = service.getInternalSelection();
      const internalItems = service.getInternalItems();

      expect(internalItems.length).toEqual(1);
      expect(internalItems[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Minus,
      );
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].selectionMode).toEqual(
        TreeViewCheckboxMode.Check,
      );
    });
  });

  describe('setConfiguration', () => {
    it('should not reconfigure if options are invalid', () => {
      const spy = spyOn(service as any, 'reconfigure').and.callThrough();
      service.setItems([]);
      service.setConfiguration(true);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should reconfigure and process items', () => {
      const spy = spyOn(service as any, 'reconfigure').and.callThrough();

      service.setItems([
        {
          value: 1,
          label: 'item 1',
        } as unknown as ITreeView,
      ]);
      service.setConfiguration(true);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setExpandForList', () => {
    it('should set parent isOpen to true when some child is selected', () => {
      service.options.expandMode = TreeViewExpandMode.Selection;
      service.setSelection(treeView[1]);

      service.getInternalItems()[1].children[0].selectionMode =
        TreeViewCheckboxMode.Check;

      expect(service.getInternalItems()[1].isOpen).toEqual(false);

      service.setExpandForList();

      expect(service.getInternalItems()[1].isOpen).toEqual(true);
    });

    it('should set parent and children isOpen to true when expand mode is All', () => {
      service.options.expandMode = TreeViewExpandMode.All;
      service.setSelection(treeView[1]);

      service.setExpandForList();

      expect(service.getInternalItems()[1].isOpen).toEqual(true);
      expect(service.getInternalItems()[1].children[0].isOpen).toEqual(true);
    });
  });
});
