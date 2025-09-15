import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColumnChangesService } from '../../services/column-changes.service';
import { DimensionsHelper } from '../../services/dimensions-helper.service';
import { ScrollbarHelper } from '../../services/scrollbar-helper.service';
import { VrcTableModule } from '../../vrc-table.module';
import { TableColumnDirective } from '../columns/column.directive';
import { TableHeaderComponent } from './header.component';

describe('TableHeaderComponent', () => {
  let fixture: ComponentFixture<TableHeaderComponent>;
  let component: TableHeaderComponent;
  let service: DimensionsHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollbarHelper, DimensionsHelper, ColumnChangesService],
      declarations: [TableHeaderComponent],
      imports: [VrcTableModule],
    }).compileComponents();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TableHeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    service = new DimensionsHelper();
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Dimension', () => {
    it('Should be Dimension', () => {
      const htmlFontSize = service.getHTMLFontSize();
      expect(htmlFontSize).toEqual(16);
    });
  });

  describe('input call', () => {
    it('Should be height is auto', () => {
      const data = (component.headerHeight = 'auto');
      component._headerHeight = data;
      expect(component._headerHeight).toEqual('auto');
    });
  });

  describe('onColumnResized', () => {
    it('should calculate rem values and emit onColumnResized with minWidth as newValue', () => {
      const width = 6.25;
      const column = new TableColumnDirective(
        {} as unknown as ColumnChangesService,
      );
      column.minWidth = 0.4375;
      column.maxWidth = 0.625;

      const spy = spyOn(component.resize, 'emit').and.callThrough();

      component.onColumnResized(width, column);

      expect(spy).toHaveBeenCalledWith({
        column,
        prevValue: column.width,
        newValue: column.minWidth,
      });
    });

    it('should calculate rem values and emit onColumnResized with calculated value as newValue', () => {
      const width = 100;
      const column = new TableColumnDirective(
        {} as unknown as ColumnChangesService,
      );
      column.minWidth = 5;
      column.maxWidth = 10;

      const spy = spyOn(component.resize, 'emit').and.callThrough();
      component.onColumnResized(width, column);

      expect(spy).toHaveBeenCalledWith({
        column,
        prevValue: column.width,
        newValue: 6.25,
      });
    });

    it('should calculate rem values and emit onColumnResized with maxWidth as newValue', () => {
      const width = 200;
      const column = new TableColumnDirective(
        {} as unknown as ColumnChangesService,
      );
      column.minWidth = 5;
      column.maxWidth = 10;

      const spy = spyOn(component.resize, 'emit').and.callThrough();

      component.onColumnResized(width, column);

      expect(spy).toHaveBeenCalledWith({
        column,
        prevValue: column.width,
        newValue: column.maxWidth,
      });
    });
  });
});
