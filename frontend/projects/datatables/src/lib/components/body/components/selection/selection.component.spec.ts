import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTableSelectionComponent } from './selection.component';

describe('DataTableSelectionComponent', () => {
  let fixture: ComponentFixture<DataTableSelectionComponent>;
  let component: DataTableSelectionComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableSelectionComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableSelectionComponent);
      component = fixture.componentInstance;
      component.rowIdentity = (row: { key: unknown }) => row.key;
      component._rows = [];
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should be undefined in rowClickActiveSelected', () => {
      expect(component.rowClickActiveSelected).toBeUndefined();
    });

    it('should be undefined in selectedRowClicked', () => {
      expect(component.selectedRowClicked).toBeUndefined();
    });

    it('should be undefined in _rows', () => {
      expect(component._rows).toEqual([]);
    });

    it('should be defined in rows', () => {
      component.rows = [{ num: 1 }];
      expect(component.rows).toBeDefined();
      expect(component._rows).toBeDefined();
      expect(component.rowClickActiveSelected).toBeUndefined();
    });

    it('should be defined in setSelectedRowClicked expect selectedRowClicked undefined', () => {
      const row = { num: 1 };
      expect(component.setSelectedRowClicked).toBeDefined();
      component.setSelectedRowClicked('click', row);
      expect(component.selectedRowClicked).toBeUndefined();
    });

    it('should be defined in setSelectedRowClicked', () => {
      const row = { num: 1 };
      expect(component.setSelectedRowClicked).toBeDefined();
      component.rowClickActiveSelected = true;
      component.setSelectedRowClicked('click', row);
      expect(component.selectedRowClicked).toEqual(row);
    });

    it('should be onActivate, selectedRowClicked is defiened', () => {
      const row = { num: 1 };

      const model: any = {
        type: 'click',
        event: {},
        row,
      };

      component.rowClickActiveSelected = true;

      component.onActivate(model, 0);
      expect(component.selectedRowClicked).toEqual(row);
    });
  });
});
