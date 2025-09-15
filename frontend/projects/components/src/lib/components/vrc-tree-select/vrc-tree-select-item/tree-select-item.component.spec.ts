import { ITreeSelect } from '../interfaces/tree-select.interface';
import { SelectableItem } from '../models/selectable-item';
import { TreeSelectService } from '../services/tree-select.service';
import { TreeSelectItemComponent } from './tree-select-item.component';

describe('TreeSelectItemComponent', () => {
  let component!: TreeSelectItemComponent;
  let service!: TreeSelectService;

  beforeEach(() => {
    service = new TreeSelectService();
    component = new TreeSelectItemComponent(service);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('set item', () => {
    it('should get default values', () => {
      const treeSelect: ITreeSelect = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);

      component.item = selectableItem;

      expect(component.isOpen).toEqual(selectableItem.isOpen);
      expect(component.allowParentSelection).toEqual(
        service.options.allowParentSelection,
      );
      expect(component.needCheckBox).toEqual(service.options.allowMultiple);
      expect(component.filter).toEqual(service.options.filter);
    });

    it('should get minLevelToSelect', () => {
      const treeSelect: ITreeSelect = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);
      component.item = selectableItem;

      expect(component.minLevelToSelect).toEqual(
        service.options.minLevelToSelect,
      );
    });

    it('should get minLevelToSelect', () => {
      const treeSelect: ITreeSelect = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);
      component.item = selectableItem;
      expect(component.hasLevel).toBeFalse();
    });
  });

  describe('select', () => {
    it('should call toggle select item when there is no children', () => {
      const treeSelect: ITreeSelect = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);

      component.item = selectableItem;
      component.onTouchedCallBack = () => {};

      const spy = spyOn(service, 'toggleItemSelection').and.callThrough();

      const event = {
        stopPropagation: jasmine.createSpy(),
        preventDefault: jasmine.createSpy(),
        target: { className: 'checkbox__label' },
      } as unknown as Event;
      component.select(event as any);

      expect(spy).toHaveBeenCalledWith(component.item);
    });

    it('should call toggle select item when there is children', () => {
      const treeSelect: ITreeSelect = {
        value: 1,
        label: 'item',
        children: [
          {
            value: 2,
            label: 'item 2',
            children: [],
          },
        ],
      };

      const selectableItem = new SelectableItem(1, 'item', treeSelect, 0);
      selectableItem.children.push(
        new SelectableItem(2, 'item 2', treeSelect.children[0], 0),
      );

      component.item = selectableItem;
      component.onTouchedCallBack = () => {};
      service.options.allowParentSelection = true;

      const spy = spyOn(service, 'toggleItemSelection').and.callThrough();

      const event = {
        stopPropagation: jasmine.createSpy(),
        preventDefault: jasmine.createSpy(),
        target: { className: 'checkbox__label' },
      } as unknown as Event;
      component.select(event as any);

      expect(spy).toHaveBeenCalledWith(component.item);
    });
  });

  describe('toggleOpen', () => {
    it('should invert isOpen', () => {
      const treeSelect: ITreeSelect = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new SelectableItem(1, 'item', treeSelect, 3);

      component.item = selectableItem;
      component.onTouchedCallBack = () => {};

      expect(component.item.isOpen).toEqual(false);

      const event = {
        stopPropagation: jasmine.createSpy(),
        target: { className: 'checkbox__label' },
      } as unknown as Event;
      component.toggleOpen(event as any);

      expect(component.item.isOpen).toEqual(true);
    });
  });

  describe('getPartialCheck', () => {
    it('should get partial selection when not all children are selected or unselected', () => {
      component.item = {
        haveAllChildrenSelected() {
          return false;
        },

        haveAllChildrenUnselected() {
          return false;
        },
      } as any;
      expect(component.isPartialSelect).toBe(true);
    });

    it('should not get partial selection when all children are selected', () => {
      component.item = {
        haveAllChildrenSelected() {
          return true;
        },
      } as any;
      expect(component.isPartialSelect).toBe(false);
    });

    it('should not get partial selection when all children are unselected', () => {
      component.item = {
        haveAllChildrenSelected() {
          return false;
        },

        haveAllChildrenUnselected() {
          return true;
        },
      } as any;
      expect(component.isPartialSelect).toBe(false);
    });
  });
});
