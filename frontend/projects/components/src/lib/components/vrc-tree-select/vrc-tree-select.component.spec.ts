import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VrCommonModule } from '../../vr-common.module';
import { OffClickDirective } from './directives/off-click.directive';
import { ITreeSelect } from './interfaces/tree-select.interface';
import { ExpandMode } from './models/expand-mode';
import { SelectableItem } from './models/selectable-item';
import { TreeSelectService } from './services/tree-select.service';
import { VrcTreeSelectComponent } from './vrc-tree-select.component';

describe('VrcTreeSelectComponent', () => {
  let component: VrcTreeSelectComponent;
  let fixture: ComponentFixture<VrcTreeSelectComponent>;
  let selectService: TreeSelectService;
  let treeSelect: ITreeSelect[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrCommonModule],
      declarations: [VrcTreeSelectComponent, OffClickDirective],
      providers: [
        TreeSelectService,
        {
          provide: NG_VALUE_ACCESSOR,
          useValue: {},
        },
      ],
    }).compileComponents();

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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTreeSelectComponent);
    component = fixture.componentInstance;
    selectService = TestBed.inject(TreeSelectService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters and setters', () => {
    it('should set items', () => {
      component.items = treeSelect;

      const selectableWithChildren = new SelectableItem(
        2,
        'item 2',
        treeSelect[1],
        0,
      );
      selectableWithChildren.children.push(
        new SelectableItem(20, 'item 20', treeSelect[1].children[0], 0),
      );

      expect(component.internalItems[0]).toEqual(
        new SelectableItem(1, 'item 1', treeSelect[0], 0),
      );
      expect(component.internalItems[1]).toEqual(selectableWithChildren);
    });

    it('should set value', () => {
      component.items = treeSelect;
      component.value = treeSelect[0];

      const selectedItem = new SelectableItem(1, 'item 1', treeSelect[0], 0);
      selectedItem.isSelected = true;
      selectedItem.isVisible = true;

      expect(component.selection).toContain(treeSelect[0]);
    });

    it('should set more selected items then maximium visible and set show more link to true', () => {
      component.items = [
        treeSelect[0],
        { value: 2, label: 'item 2', children: [] },
      ];
      component.value = [
        treeSelect[0],
        { value: 2, label: 'item 2', children: [] },
      ];

      component.maxVisibleItemCount = 1;
      const selection = component.selection;

      expect(selection.length).toEqual(2);
      expect(component.exceedAmount).toEqual(1);
      expect(component.showMoreLink).toEqual(true);
    });

    it('should force multiple to true if allowParentSelection is true', () => {
      expect(component.allowParentSelection).toEqual(false);
      expect(component.multiple).toEqual(false);

      component.allowParentSelection = true;

      expect(component.multiple).toEqual(true);
    });

    it('should set allowParentSelection to false if multiple is false', () => {
      expect(component.allowParentSelection).toEqual(false);
      expect(component.multiple).toEqual(false);

      component.allowParentSelection = true;

      expect(component.allowParentSelection).toEqual(true);
      expect(component.multiple).toEqual(true);

      component.multiple = false;

      expect(component.allowParentSelection).toEqual(false);
      expect(component.multiple).toEqual(false);
    });

    it('should set multiple', () => {
      expect(component.multiple).toEqual(false);

      component.multiple = true;

      expect(component.multiple).toEqual(true);
    });

    it('should set multiple to false and force allowParentSelection to false if its true', () => {
      component.multiple = true;
      component.allowParentSelection = true;

      expect(component.multiple).toEqual(true);
      expect(component.allowParentSelection).toEqual(true);

      component.multiple = false;

      expect(component.multiple).toEqual(false);
      expect(component.allowParentSelection).toEqual(false);
    });

    it('should set resetAllSelected', () => {
      expect(component.resetAllSelected).toEqual(false);

      component.resetAllSelected = true;

      expect(component.resetAllSelected).toEqual(true);
    });

    it('should set resetAllSelectedLabel', () => {
      expect(component.resetAllSelectedLabel).toEqual('Limpar Seleção');

      component.resetAllSelectedLabel = 'APAGA TUDO!';

      expect(component.resetAllSelectedLabel).toEqual('APAGA TUDO!');
    });

    it('should set filtercaseSensitive', () => {
      expect(component.filterCaseSensitive).toEqual(false);

      component.filterCaseSensitive = true;

      expect(component.filterCaseSensitive).toEqual(true);
    });

    it('should set expandMode', () => {
      expect(component.expandMode).toEqual(ExpandMode.None);

      component.expandMode = ExpandMode.All;

      expect(component.expandMode).toEqual(ExpandMode.All);
    });

    it('should set maxVisibleItemCount', () => {
      expect(component.maxVisibleItemCount).toEqual(1);

      component.maxVisibleItemCount = 2;

      expect(component.maxVisibleItemCount).toEqual(2);
    });

    it('should set filter if there is no item', () => {
      expect(component.filter).toEqual('');

      component.filter = 'item';

      expect(component.filter).toEqual('item');
    });

    it('should set filter if there are items', () => {
      component.items = treeSelect;

      component.filter = 'item';

      expect(component.filter).toEqual('item');
      expect(component.internalItems.length).toEqual(2);
      expect(component.internalItems[0].matchFilter).toEqual(true);
      expect(component.internalItems[1].matchFilter).toEqual(true);
    });

    it('should set filter and return nothing', () => {
      component.items = treeSelect;

      component.filter = 'no result';

      expect(component.internalItems.length).toEqual(2);
      expect(component.internalItems[0].matchFilter).toEqual(false);
      expect(component.internalItems[1].matchFilter).toEqual(false);
    });

    it('should set filter and search using case sensitive', () => {
      component.items = [
        {
          value: 1,
          label: 'item 1',
          children: [],
        },
        {
          value: 2,
          label: 'Item 2',
          children: [],
        },
      ];

      component.filterCaseSensitive = true;
      component.filter = 'Item';

      expect(component.internalItems.length).toEqual(2);
      expect(component.internalItems[0].matchFilter).toEqual(false);
      expect(component.internalItems[1].matchFilter).toEqual(true);
    });
  });

  describe('toogle', () => {
    it('should call toggleOpen and set _haveFocus to true on toggle', () => {
      const event = {
        preventDefault: jasmine.createSpy(),
      } as unknown as Event;

      component.toggle(event);

      expect((component as any)._haveFocus).toEqual(true);
    });
  });

  describe('removeItem', () => {
    it('should call toggleItemSelection on removeItem', () => {
      const event = {
        stopPropagation: jasmine.createSpy(),
      } as unknown as Event;

      const selectableItem = new SelectableItem(1, 'item 1', treeSelect[0], 0);

      component.items = treeSelect;
      component.removeItem(event, selectableItem);

      expect(component.selection).toEqual([]);
    });
  });

  describe('clickedOutside', () => {
    it('should set _haveFocus to false', () => {
      component.clickedOutside();
      expect((component as any)._haveFocus).toEqual(false);
    });

    it('should do nothing when input is focused', () => {
      component.setInputFocus();
      component.clickedOutside();
      expect((component as any)._haveFocus).toEqual(false);
    });

    it('should call close when item is open and input is not focused', () => {
      component.setInputFocusOut();
      component.clickedOutside();

      expect((component as any)._haveFocus).toEqual(false);
    });

    it('should call onTouched when item have focus and its closed', () => {
      const event = {
        preventDefault: jasmine.createSpy(),
      } as unknown as Event;

      component.toggle(event);
      component.onClickOutsideTouch();
      component.setInputFocusOut();
      component.clickedOutside();

      expect((component as any)._haveFocus).toEqual(false);
    });
  });

  describe('reset', () => {
    it('should reset selections', () => {
      const event = {
        stopPropagation: jasmine.createSpy(),
      } as unknown as Event;

      const selectableItem = new SelectableItem(1, 'item 1', treeSelect[0], 0);

      component.items = treeSelect;
      component.reset(event);

      expect(component.selection).toEqual([]);
    });
  });

  describe('writeValue', () => {
    it('should set selection', () => {
      component.items = treeSelect;
      component.writeValue(treeSelect[0]);

      const selectedItem = new SelectableItem(1, 'item 1', treeSelect[0], 0);
      selectedItem.isVisible = true;
      selectedItem.isSelected = true;

      component.multiple = false;

      expect(component.selection).toContain(treeSelect[0]);
    });
  });

  describe('callback methods', () => {
    it('should be registerOnChange', () => {
      const fn: any = (_: unknown) => {};
      component.registerOnChange(fn);
      expect(component.registerOnChange).toBeDefined();
    });

    it('should be registerOnTouched', () => {
      const fn = () => {};
      component.registerOnTouched(fn);
      expect(component.registerOnTouched).toBeDefined();
    });
  });

  describe('getVisibleItems', () => {
    it('should get the visible selection', () => {
      const testComponent = component as any;
      const internalItems = [
        { children: [{ isSelected: true }, { isSelected: false }] },
        { isSelected: true },
        { children: [{ isSelected: false }, { isSelected: true }] },
        { isSelected: false },
        { isSelected: true },
      ];
      selectService.setItems;
      spyOn(selectService, 'getInternalItems').and.returnValue(
        internalItems as any,
      );

      testComponent.maxVisibleItemCount = 3;
      expect(testComponent.visibleSelection).toEqual([]);
    });
    it('should return an empty array if no items are selected', () => {
      const testComponent = component as any;
      const items = [
        { name: 'item 1', isSelected: false },
        { name: 'item 2', isSelected: false },
        { name: 'item 3', isSelected: false },
      ];
      const result = testComponent.findSelected(items, []);
      expect(result).toEqual([]);
    });

    it('should return an array with the selected item(s)', () => {
      const testComponent = component as any;
      const items = [
        { name: 'item 1', isSelected: false },
        { name: 'item 2', isSelected: true },
        { name: 'item 3', isSelected: false },
      ];
      const result = testComponent.findSelected(items, []);
      expect(result).toEqual([{ name: 'item 2', isSelected: true }]);
    });

    it('should return an array with all selected items, including children', () => {
      const testComponent = component as any;
      const items = [
        {
          name: 'item 1',
          isSelected: false,
          children: [
            { name: 'item 1.1', isSelected: true },
            { name: 'item 1.2', isSelected: false },
          ],
        },
        { name: 'item 2', isSelected: true },
        {
          name: 'item 3',
          isSelected: false,
          children: [
            { name: 'item 3.1', isSelected: true },
            { name: 'item 3.2', isSelected: true },
          ],
        },
      ];
      const result = testComponent.findSelected(items, []);
      expect(result).toEqual([
        { name: 'item 1.1', isSelected: true },
        { name: 'item 2', isSelected: true },
        { name: 'item 3.1', isSelected: true },
        { name: 'item 3.2', isSelected: true },
      ]);
    });
  });

  describe('selectedChildrenAndParents', () => {
    it('should emit the selected children and parents', () => {
      const mockEmitedValue = [
        {
          value: 1,
          label: 'item 1',
          children: [{ value: 2, label: 'item 2', children: [] }],
        },
      ];
      const spyOutPut = spyOn(component.onUpdateChildrenAndParents, 'emit');

      const anyComponent = component as any;

      anyComponent._selectService.selectedChildrenAndParents$.next(
        mockEmitedValue,
      );

      expect(spyOutPut).toHaveBeenCalledWith(mockEmitedValue);
    });
  });
});
