import { ITreeSelect } from '../interfaces/tree-select.interface';
import { ExpandMode } from '../models/expand-mode';
import { SelectableItem } from '../models/selectable-item';
import { TreeSelectDefaultOptions } from '../models/tree-select-default-options';
import { TreeSelectService } from './tree-select.service';

describe('VrAutocompleteService', () => {
  let service: TreeSelectService;
  let treeSelect: ITreeSelect[] = [];

  beforeEach(() => {
    service = new TreeSelectService();
    service.setOptions(new TreeSelectDefaultOptions());
    treeSelect = [
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
    service.setItems(treeSelect);
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

  describe('reset', () => {
    it('should reset values', () => {
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

      service.setItems(newItems);
      service.setSelection(newItems[0]);
      service.setSelection(newItems[0].children[0]);

      service.reset();
      expect(service.getInternalSelection()).toEqual([]);
    });
  });

  it('should invert isOpen value on toggleOpen', () => {
    service.setOptions({ isOpen: false });
    service.toggleOpen();
    expect(service.options.isOpen).toEqual(true);
  });

  it('should get internal items', () => {
    const selectableWithChildren = new SelectableItem(
      2,
      'item 2',
      treeSelect[1],
      0,
    );
    selectableWithChildren.children.push(
      new SelectableItem(20, 'item 20', treeSelect[1].children[0], 0),
    );

    const items = service.getInternalItems();
    expect(items[0]).toEqual(new SelectableItem(1, 'item 1', treeSelect[0], 0));
    expect(items[1]).toEqual(selectableWithChildren);
  });

  describe('setSelection', () => {
    it('should set selection', () => {
      const newTreeSelect: ITreeSelect = {
        value: 3,
        label: 'item 3',
        children: [],
      };
      service.setSelection(newTreeSelect);

      expect(service.options.model).toEqual([newTreeSelect]);
    });

    it('should set all to unselected when received value is empty', () => {
      service.setSelection(treeSelect[0]);
      expect(service.getInternalSelection()[0].isSelected).toEqual(true);

      service.setSelection([]);

      expect(service.options.model).toEqual([]);
      expect(service.getInternalSelection().length).toEqual(1);
    });
  });

  describe('toggleItemSelection', () => {
    it('should set isSelected to true and isOpen to false', () => {
      const newTreeSelect: ITreeSelect = {
        value: 3,
        label: 'item 3',
        children: [],
      };

      const newTreeSelectChildren: ITreeSelect[] = [
        {
          value: 30,
          label: 'item 30',
          children: [],
        },
      ];

      const selectableItem: SelectableItem = new SelectableItem(
        3,
        'item 3',
        newTreeSelect,
        0,
      );

      selectableItem.children = [
        new SelectableItem(30, 'item 30', newTreeSelectChildren[0], 0),
      ];

      service.options.allowMultiple = true;
      service.options.closeOnSelection = true;

      service.toggleItemSelection(selectableItem);

      expect(selectableItem.isSelected).toEqual(true);
      expect(selectableItem.children[0].isSelected).toEqual(true);
      expect(selectableItem.isOpen).toEqual(false);
    });

    it('should set isSelected to true and isOpen should be true', () => {
      const newTreeSelect: ITreeSelect = {
        value: 3,
        label: 'item 3',
        children: [],
      };

      const newTreeSelectChildren: ITreeSelect[] = [
        {
          value: 30,
          label: 'item 30',
          children: [],
        },
      ];

      const selectableItem: SelectableItem = new SelectableItem(
        3,
        'item 3',
        newTreeSelect,
        0,
      );

      selectableItem.children = [
        new SelectableItem(30, 'item 30', newTreeSelectChildren[0], 0),
      ];

      service.options.allowMultiple = false;
      service.options.closeOnSelection = false;
      selectableItem.isOpen = true;

      service.toggleItemSelection(selectableItem);

      expect(selectableItem.isSelected).toEqual(true);
      expect(selectableItem.isOpen).toEqual(true);
    });

    it('should output selected children and parents', () => {
      const mockTreeSelectItens = [
        {
          value: 1,
          label: '2',
          children: [
            {
              value: 2,
              label: '3',
              children: [],
            },
          ],
        } as unknown as ITreeSelect,
      ];
      const spy = spyOn(
        service.selectedChildrenAndParents$,
        'next',
      ).and.callThrough();

      service.options.allowMultiple = true;
      service.options.closeOnSelection = true;

      service.setItems(mockTreeSelectItens);
      const parent = service.getInternalItems()[0];
      service.toggleItemSelection(parent);

      expect(spy).toHaveBeenCalledWith(mockTreeSelectItens);
    });

    it('should output selected children of children and their parents', () => {
      const mockTreeSelectItens = [
        {
          value: 1,
          label: '2',
          children: [
            {
              value: 2,
              label: '3',
              children: [
                {
                  value: 3,
                  label: '4',
                  children: [],
                },
              ],
            },
          ],
        } as unknown as ITreeSelect,
        {
          value: 2,
          label: '3',
          children: [
            {
              value: 4,
              label: '5',
              children: [
                {
                  value: 6,
                  label: '7',
                  children: [],
                },
              ],
            },
          ],
        } as unknown as ITreeSelect,
      ];
      const expectedResult = [
        {
          value: 1,
          label: '2',
          children: [
            {
              value: 2,
              label: '3',
              children: [
                {
                  value: 3,
                  label: '4',
                  children: [],
                },
              ],
            },
          ],
        } as unknown as ITreeSelect,
      ];
      const spy = spyOn(
        service.selectedChildrenAndParents$,
        'next',
      ).and.callThrough();

      service.options.allowMultiple = true;
      service.options.closeOnSelection = true;

      service.setItems(mockTreeSelectItens);
      const parent = service.getInternalItems()[0].children[0];
      service.toggleItemSelection(parent);

      expect(spy).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('getInternalSelection', () => {
    it('should return empty when have no items', () => {
      service.setItems([]);

      const internalSelection = service.getInternalSelection();

      expect(internalSelection.length).toEqual(0);
    });

    it('should getInternalSelection return selected children and set parent isSelected to true when all children are selected', () => {
      service.setItems(treeSelect);
      service.setSelection(treeSelect[1].children);

      service.options.allowParentSelection = true;
      service.options.maxVisibleItemCount = 1;

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(2);
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].isVisible).toEqual(true);
      expect(internalSelection[0].isSelected).toEqual(true);
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
      service.options.maxVisibleItemCount = 1;

      service.setItems(newItems);
      service.setSelection(newItems[0]);
      service.setSelection(newItems[0].children[0]);

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(1);
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].isVisible).toEqual(true);
      expect(internalSelection[0].isSelected).toEqual(true);
    });

    it('should getInternalSelection return selected children and set parent isSelected to false when some children are unselected', () => {
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
      service.options.maxVisibleItemCount = 1;

      service.setItems(newItems);
      service.setSelection(newItems[0]);
      service.setSelection(newItems[0].children[0]);

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(1);
      expect(internalSelection.length).toEqual(1);
      expect(internalSelection[0].isVisible).toEqual(true);
      expect(internalSelection[0].isSelected).toEqual(true);
    });

    it('should getInternalSelection return empty and set parent isSelected to false when all children are unselected', () => {
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
      service.options.maxVisibleItemCount = 1;

      service.setItems(newItems);
      service.setSelection(newItems[0]);

      const internalSelection = service.getInternalSelection();

      expect(service.getInternalItems().length).toEqual(1);
      expect(internalSelection.length).toEqual(0);
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
        } as unknown as ITreeSelect,
      ]);
      service.setConfiguration(true);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setExpandForList', () => {
    it('should set parent isOpen to true when some child is selected', () => {
      service.options.expandMode = ExpandMode.Selection;
      service.setSelection(treeSelect[1]);

      service.getInternalItems()[1].children[0].isSelected = true;

      expect(service.getInternalItems()[1].isOpen).toEqual(false);

      service.setExpandForList();

      expect(service.getInternalItems()[1].isOpen).toEqual(true);
    });
  });
});
