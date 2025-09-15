import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

import { VrCommonModule } from '../../vr-common.module';
import { ITreeView } from './interfaces/tree-view.interface';
import { TreeViewCheckboxMode } from './models/tree-view-checkbox-model';
import { TreeViewExpandMode } from './models/tree-view-expand-mode';
import { TreeViewSelectableItem } from './models/tree-view-selectable-item';
import { TreeViewService } from './services/tree-view.service';
import { VrcTreeViewComponent } from './vrc-tree-view.component';

describe('VrcTreeViewComponent', () => {
  let component: VrcTreeViewComponent;
  let fixture: ComponentFixture<VrcTreeViewComponent>;

  let treeView: ITreeView[] = [];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrCommonModule, FormsModule, ReactiveFormsModule],
      declarations: [VrcTreeViewComponent],
      providers: [
        TreeViewService,
        {
          provide: NG_VALUE_ACCESSOR,
          useValue: {},
        },
      ],
    }).compileComponents();

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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getters and setters', () => {
    it('should set items', () => {
      component.items = treeView;

      const selectableWithChildren = new TreeViewSelectableItem(
        2,
        'item 2',
        treeView[1],
      );
      selectableWithChildren.children.push(
        new TreeViewSelectableItem(20, 'item 20', treeView[1].children[0]),
      );

      expect(component.internalItems[0]).toEqual(
        new TreeViewSelectableItem(1, 'item 1', treeView[0]),
      );
      expect(component.internalItems[1]).toEqual(selectableWithChildren);
    });

    it('should set value', () => {
      component.items = treeView;
      component.value = treeView[0];

      const selectedItem = new TreeViewSelectableItem(1, 'item 1', treeView[0]);
      selectedItem.selectionMode = TreeViewCheckboxMode.Check;

      expect(component.selection).toContain(selectedItem);
    });

    it('should set filterItems', () => {
      const filterItems = [
        { value: 1, label: 'label 1' },
        { value: 2, label: 'label 2' },
      ];
      component.filterItems = filterItems;

      expect(component.filterItems).toEqual(filterItems);
    });

    it('should set filterItems, selectedFilter and call filter should change matchFilter value to true of first item', () => {
      component.items = treeView;
      const filterItems = [
        { value: 1, label: 'label 1' },
        { value: 2, label: 'label 2' },
      ];
      component.filterItems = filterItems;
      component.selectedFilter = '1';

      expect(component.selectedFilter).toEqual('1');
      expect(component.internalItems[0].matchFilter).toEqual(true);
      expect(component.internalItems[1].matchFilter).toEqual(false);
    });

    it('should call filter with default values and show every item', () => {
      component.items = treeView;
      component.filter = '';

      expect(component.selectedFilter).toEqual('-1');
      expect(component.internalItems[0].matchFilter).toEqual(true);
      expect(component.internalItems[1].matchFilter).toEqual(true);
      expect(component.internalItems[1].children[0].matchFilter).toEqual(true);
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

    it('should set filtercaseSensitive', () => {
      expect(component.filterCaseSensitive).toEqual(false);

      component.filterCaseSensitive = true;

      expect(component.filterCaseSensitive).toEqual(true);
    });

    it('should set expandMode', () => {
      expect(component.expandMode).toEqual(TreeViewExpandMode.None);

      component.expandMode = TreeViewExpandMode.All;

      expect(component.expandMode).toEqual(TreeViewExpandMode.All);
    });

    it('should set filter if there is no item', () => {
      expect(component.filter).toEqual('');

      component.filter = 'item';

      expect(component.filter).toEqual('item');
    });

    it('should set filter if there are items', () => {
      component.items = treeView;

      component.filter = 'item';

      expect(component.filter).toEqual('item');
      expect(component.internalItems.length).toEqual(2);
      expect(component.internalItems[0].matchFilter).toEqual(true);
      expect(component.internalItems[1].matchFilter).toEqual(true);
    });

    it('should set filter and return nothing', () => {
      component.items = treeView;

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

  describe('removeItem', () => {
    it('should call toggleItemSelection on removeItem', () => {
      const event = {
        stopPropagation: jasmine.createSpy(),
      } as unknown as Event;

      const selectableItem = new TreeViewSelectableItem(
        1,
        'item 1',
        treeView[0],
      );

      component.items = treeView;
      component.removeItem(event, selectableItem);

      expect(component.selection).toEqual([]);
    });
  });

  describe('writeValue', () => {
    it('should set selection', () => {
      component.items = treeView;
      component.writeValue(treeView[0]);

      const selectedItem = new TreeViewSelectableItem(1, 'item 1', treeView[0]);
      selectedItem.selectionMode = TreeViewCheckboxMode.Check;

      component.multiple = false;

      expect(component.selection).toContain(selectedItem);
    });
  });
});
