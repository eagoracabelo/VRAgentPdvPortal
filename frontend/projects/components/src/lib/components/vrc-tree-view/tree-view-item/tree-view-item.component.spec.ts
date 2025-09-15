import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewSelectableItem } from '../models/tree-view-selectable-item';
import { TreeViewService } from '../services/tree-view.service';
import { TreeViewItemComponent } from './tree-view-item.component';

describe('TreeViewItemComponent', () => {
  let component!: TreeViewItemComponent;
  let service!: TreeViewService;

  beforeEach(() => {
    service = new TreeViewService();
    component = new TreeViewItemComponent(service);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  describe('set item', () => {
    it('should get default values', () => {
      const treeView: ITreeView = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new TreeViewSelectableItem(1, 'item', treeView);

      component.item = selectableItem;

      expect(component.isOpen).toEqual(selectableItem.isOpen);
      expect(component.allowParentSelection).toEqual(
        service.options.allowParentSelection,
      );
      expect(component.needCheckBox).toEqual(service.options.allowMultiple);
      expect(component.filter).toEqual(service.options.filter);
    });
  });

  describe('select', () => {
    it('should call toggle select item when there is no children', () => {
      const treeSelect: ITreeView = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new TreeViewSelectableItem(1, 'item', treeSelect);

      component.item = selectableItem;
      component.onTouchedCallBack = () => {};

      const spy = spyOn(service, 'toggleItemSelection').and.callThrough();

      const event = {
        stopPropagation: jasmine.createSpy(),
        preventDefault: jasmine.createSpy(),
      } as unknown as Event;
      component.select(event);

      expect(spy).toHaveBeenCalledWith(component.item);
    });

    it('should call toggle select item when there is children', () => {
      const treeSelect: ITreeView = {
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

      const selectableItem = new TreeViewSelectableItem(1, 'item', treeSelect);
      selectableItem.children.push(
        new TreeViewSelectableItem(2, 'item 2', treeSelect.children[0]),
      );

      component.item = selectableItem;
      component.onTouchedCallBack = () => {};
      service.options.allowParentSelection = true;

      const spy = spyOn(service, 'toggleItemSelection').and.callThrough();

      const event = {
        stopPropagation: jasmine.createSpy(),
        preventDefault: jasmine.createSpy(),
      } as unknown as Event;
      component.select(event);

      expect(spy).toHaveBeenCalledWith(component.item);
    });
  });

  describe('toggleOpen', () => {
    it('should invert isOpen', () => {
      const treeSelect: ITreeView = {
        value: 1,
        label: 'item',
        children: [],
      };

      const selectableItem = new TreeViewSelectableItem(1, 'item', treeSelect);

      component.item = selectableItem;
      component.onTouchedCallBack = () => {};

      expect(component.item.isOpen).toEqual(false);

      const event = {
        stopPropagation: jasmine.createSpy(),
      } as unknown as Event;
      component.toggleOpen(event);

      expect(component.item.isOpen).toEqual(true);
    });
  });
});
