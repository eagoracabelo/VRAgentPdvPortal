import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ColumnChangesService } from '../../services/column-changes.service';

import { Injector, runInInjectionContext } from '@angular/core';
import { DimensionsHelper } from '../../services/dimensions-helper.service';
import { DataTableColumnDirective } from '../columns/column.directive';
import { DataTableHeaderComponent } from './header.component';

describe('DataTableHeaderComponent', () => {
  let fixture: ComponentFixture<DataTableHeaderComponent>;
  let component: DataTableHeaderComponent;
  let element: HTMLElement;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableHeaderComponent],
      providers: [DimensionsHelper, ColumnChangesService],
    });

    injector = TestBed.inject(Injector);
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableHeaderComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement as HTMLElement;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('onColumnResized', () => {
    it('should calculate rem values and emit onColumnResized with minWidth as newValue', () => {
      const width = 100;
      let column: DataTableColumnDirective;
      runInInjectionContext(injector, () => {
        column = new DataTableColumnDirective(
          TestBed.inject(ColumnChangesService),
        );
      });
      column!.minWidth = 7;
      column!.maxWidth = 10;

      const spy = spyOn(component.resize, 'emit').and.callThrough();

      component.onColumnResized(width, column!);

      expect(spy).toHaveBeenCalledWith({
        column: column!,
        prevValue: column!.width,
        newValue: column!.minWidth,
      });
    });

    it('should calculate rem values and emit onColumnResized with calculated value as newValue', () => {
      const width = 100;
      let column: DataTableColumnDirective;
      runInInjectionContext(injector, () => {
        column = new DataTableColumnDirective(
          TestBed.inject(ColumnChangesService),
        );
      });
      column!.minWidth = 5;
      column!.maxWidth = 10;

      const spy = spyOn(component.resize, 'emit').and.callThrough();

      component.onColumnResized(width, column!);

      expect(spy).toHaveBeenCalledWith({
        column: column!,
        prevValue: column!.width,
        newValue: 6.25,
      });
    });

    it('should calculate rem values and emit onColumnResized with maxWidth as newValue', () => {
      const width = 200;
      let column: DataTableColumnDirective;
      runInInjectionContext(injector, () => {
        column = new DataTableColumnDirective(
          TestBed.inject(ColumnChangesService),
        );
      });
      column!.minWidth = 5;
      column!.maxWidth = 10;

      const spy = spyOn(component.resize, 'emit').and.callThrough();

      component.onColumnResized(width, column!);

      expect(spy).toHaveBeenCalledWith({
        column: column!,
        prevValue: column!.width,
        newValue: column!.maxWidth,
      });
    });
  });

  describe('getHeaderHeight', () => {
    it('should return 2.625 when columnGroups.length is greater than 1', () => {
      const context = { columnGroups: [1, 2, 3] };
      const headerHeight = component.getHeaderHeight.call(context);
      expect(headerHeight).toEqual(2.625);
    });

    it('should return the parsed headerHeight value when columnGroups.length is 1', () => {
      const context = { headerHeight: '3rem', columnGroups: [1] };
      const headerHeight = component.getHeaderHeight.call(context);
      expect(headerHeight).toEqual('3');
    });
  });

  describe('setColumnGroups', () => {
    it('should correctly set column groups with one column', () => {
      const columnsByPin = [
        { type: 'center', columns: [{ columnGroup: 'Group 1', width: 100 }] },
      ];
      component['_columnsByPin'] = columnsByPin;
      component.setColumnGroups();
      expect(component.columnGroups).toEqual([
        {
          label: 'Group 1',
          width: 100,
          columns: [{ columnGroup: 'Group 1', width: 100 }],
        },
      ]);
    });

    it('should correctly set column groups with multiple columns in one group', () => {
      const columnsByPin = [
        {
          type: 'center',
          columns: [
            { columnGroup: 'Group 1', width: 100 },
            { columnGroup: 'Group 1', width: 150 },
            { columnGroup: 'Group 1', width: 200 },
          ],
        },
      ];
      component['_columnsByPin'] = columnsByPin;
      component.setColumnGroups();
      expect(component.columnGroups).toEqual([
        {
          label: 'Group 1',
          width: 450,
          columns: [
            { columnGroup: 'Group 1', width: 100 },
            { columnGroup: 'Group 1', width: 150 },
            { columnGroup: 'Group 1', width: 200 },
          ],
        },
      ]);
    });

    it('should not set column groups if there are no center columns', () => {
      const columnsByPin = [
        { type: 'left', columns: [{ columnGroup: 'Group 1', width: 100 }] },
        { type: 'right', columns: [{ columnGroup: 'Group 2', width: 150 }] },
      ];
      component['_columnsByPin'] = columnsByPin;
      component.setColumnGroups();
      expect(component.columnGroups).toEqual([]);
    });
  });

  describe('headerWidth', () => {
    it('should be headerWidth to 100%', () => {
      expect(component.headerWidth).toEqual('100%');
    });

    it('should be bodyWidth to 1.035rem', () => {
      component.scrollbarH = true;
      component.innerWidth = 1;
      expect(component.headerWidth).toEqual('1.035rem');
    });
  });
});
