import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DimensionsHelper } from '../../services/dimensions-helper.service';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { DataTableBodyComponent } from './body.component';
import { DataTableBodyCellComponent } from './components/body-cell/body-cell.component';
import { DataTableRowWrapperComponent } from './components/body-row-wrapper/body-row-wrapper.component';
import { DataTableBodyRowComponent } from './components/body-row/body-row.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ScrollerComponent } from './components/scroller/scroller.component';
import { DataTableSelectionComponent } from './components/selection/selection.component';
import { DataTableSummaryRowComponent } from './components/summary/summary-row.component';

describe('DataTableBodyComponent', () => {
  let fixture: ComponentFixture<DataTableBodyComponent>;
  let component: DataTableBodyComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataTableBodyComponent,
        DataTableBodyRowComponent,
        DataTableRowWrapperComponent,
        DataTableBodyCellComponent,
        DataTableSelectionComponent,
        DataTableSummaryRowComponent,
        ProgressBarComponent,
        ScrollerComponent,
      ],
      providers: [ScrollbarHelper, DimensionsHelper],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableBodyComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Paging', () => {
    it('should have correct indexes for normal paging with rows > pageSize', () => {
      component.externalPaging = false;
      component.rows = [
        { num: 1 },
        { num: 2 },
        { num: 3 },
        { num: 4 },
        { num: 5 },
        { num: 6 },
        { num: 7 },
        { num: 8 },
        { num: 9 },
        { num: 10 },
      ];
      component.pageSize = 10;
      component.offset = 1;
      component.rowCount = 20;
      const expectedIndexes = { first: 10, last: 20 };
      component.updateIndexes();
      expect(component.indexes).toEqual(expectedIndexes);
    });

    it('should have correct indexes for normal paging with rows < pageSize', () => {
      component.externalPaging = false;
      component.rows = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }];
      component.pageSize = 5;
      component.offset = 1;
      component.rowCount = 9;
      const expectedIndexes = { first: 5, last: 9 };
      component.updateIndexes();
      expect(component.indexes).toEqual(expectedIndexes);
    });

    it('should have correct indexes for external paging with rows > pageSize', () => {
      component.externalPaging = true;
      component.rows = [
        { num: 1 },
        { num: 2 },
        { num: 3 },
        { num: 4 },
        { num: 5 },
        { num: 6 },
        { num: 7 },
        { num: 8 },
        { num: 9 },
        { num: 10 },
      ];
      component.pageSize = 10;
      component.offset = 1;
      component.rowCount = 20;
      const expectedIndexes = { first: 0, last: 10 };
      component.updateIndexes();
      expect(component.indexes).toEqual(expectedIndexes);
    });

    it('should have correct indexes for external paging with rows < pageSize', () => {
      component.externalPaging = true;
      component.rows = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }];
      component.pageSize = 5;
      component.offset = 1;
      component.rowCount = 9;
      const expectedIndexes = { first: 0, last: 5 };
      component.updateIndexes();
      expect(component.indexes).toEqual(expectedIndexes);
    });
  });

  describe('Summary row', () => {
    it('should not return custom styles for a bottom summary row if a scrollbar mode is off', () => {
      const styles = component.getBottomSummaryRowStyles();
      expect(styles).toBeFalsy();
    });

    it('should return custom styles for a bottom summary row if a scrollbar mode is on', () => {
      component.rowHeight = 50;
      component.scrollbarV = true;
      component.virtualization = true;
      component.rows = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }];
      const styles = component.getBottomSummaryRowStyles();
      expect(styles).toBeDefined();
    });
  });

  describe('hasError', () => {
    it('should return false if errorRows is empty', () => {
      component.errorRows = [];
      const res = component.hasError({ teste: 'teste' });
      expect(res).toBeFalse();
    });

    it('should return false if row is not in errorRows', () => {
      component.errorRows = [{ teste: 'teste 1' }];
      const res = component.hasError({ teste: 'teste 2' });
      expect(res).toBeFalse();
    });

    it('should return true if row is in errorRows', () => {
      component.errorRows = [{ teste: 'teste' }];
      const res = component.hasError({ teste: 'teste' });
      expect(res).toBeTrue();
    });
  });

  describe('bodyWidth', () => {
    it('should be bodyWidth to 100%', () => {
      expect(component.bodyWidth).toEqual('100%');
    });

    it('should be bodyWidth to 1.035rem', () => {
      component.scrollbarH = true;
      component.innerWidth = 1;
      expect(component.bodyWidth).toEqual('1.035rem');
    });
  });
});
