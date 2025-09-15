import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { TableBodyComponent } from './body.component';
import { TableBodyRowComponent } from './components/body-row/body-row.component';
import { TableRowWrapperComponent } from './components/body-row-wrapper/body-row-wrapper.component';
import { TableBodyCellComponent } from './components/body-cell/body-cell.component';
import { TableSelectionComponent } from './components/selection/selection.component';
import { TableSummaryRowComponent } from './components/summary/summary-row.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ScrollerComponent } from './components/scroller/scroller.component';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
describe('TableBodyComponent', () => {
  let fixture: ComponentFixture<TableBodyComponent>;
  let component: TableBodyComponent;
  let element;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableBodyComponent,
        TableBodyRowComponent,
        TableRowWrapperComponent,
        TableBodyCellComponent,
        TableSelectionComponent,
        TableSummaryRowComponent,
        ProgressBarComponent,
        ScrollerComponent,
        TranslatePipe,
      ],
      providers: [ScrollbarHelper],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TableBodyComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Paging', () => {
    it('should have correct indexes for normal paging with rows > pageSize', () => {
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
      component.rows = [{ num: 1 }, { num: 2 }, { num: 3 }, { num: 4 }];
      component.pageSize = 5;
      component.offset = 1;
      component.rowCount = 9;
      const expectedIndexes = { first: 5, last: 9 };
      component.updateIndexes();
      expect(component.indexes).toEqual(expectedIndexes);
    });

    xit('should have correct indexes for external paging with rows > pageSize', () => {
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

    xit('should have correct indexes for external paging with rows < pageSize', () => {
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

  describe('input call', () => {
    it('should be innerWidth is number', () => {
      expect(component.innerWidth).toBeUndefined();
      component.innerWidth = 1;
      expect(component.innerWidth).toEqual(1);
    });
    it('Should be height not rem', () => {
      component.scrollbarV = true;
      expect(component.scrollbarV).toBeTrue();
      expect(component._bodyHeight).toBeUndefined();
      const data = (component.bodyHeight = '1');
      component._bodyHeight = data;
      expect(component._bodyHeight).toEqual('1');
    });
    it('Should be height is auto', () => {
      const data = (component.bodyHeight = 'auto');
      component._bodyHeight = data;
      expect(component._bodyHeight).toEqual('auto');
    });
  });
});
