import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TableHeaderCellComponent } from '../../public-api';
import { ColumnChangesService } from '../services/column-changes.service';
import { DimensionsHelper } from '../services/dimensions-helper.service';
import { ScrollbarHelper } from '../services/scrollbar-helper.service';
import { SortDirection } from '../types/sort-direction.type';
import { VrcTableModule } from '../vrc-table.module';
import { TableBodyComponent } from './body/body.component';
import { TableComponent } from './table.component';

let fixture: ComponentFixture<any>;
let component: any;

describe('TableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollbarHelper, DimensionsHelper, ColumnChangesService],
      imports: [VrcTableModule],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TableComponent);
      component = fixture.componentInstance;

      component.scrollbarH = 100;
      component.headerHeight = 50;
      component.footerHeight = 50;
      component.rowHeight = 'auto';
    });
  }));

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('Deve enviar as informações das linhas do TableComponent para o TableBodyComponent', () => {
    const initialRows = [
      { id: 5, user: 'Sam', age: 35 },
      { id: 20, user: 'Bob', age: 50 },
      { id: 12, user: 'Joe', age: 60 },
    ];

    component.rows = initialRows;
    component.columnTwoProp = 'user';
    fixture.detectChanges();

    const dEBody = fixture.debugElement.query(
      By.directive(TableBodyComponent),
    ).componentInstance;

    expect(dEBody.rows).toHaveSize(3);
    expect(dEBody.rows[0].user).toEqual('Sam');
    expect(dEBody.rows[1].user).toEqual('Bob');
    expect(dEBody.rows[2].user).toEqual('Joe');
  });

  it('Deve ordenar internamente valores numéricos', () => {
    const initialRows = [{ id: 5 }, { id: 20 }, { id: 12 }];

    const columns = [
      {
        prop: 'id',
      },
    ];

    component.sorts = { column: 'id', dir: 'desc' };
    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    const dEHCell = fixture.debugElement.query(
      By.directive(TableHeaderCellComponent),
    ).componentInstance;

    const spy = spyOn(dEHCell.sort, 'emit').and.callThrough();
    const spy2 = spyOn(component, 'onColumnSort').and.callThrough();
    const spy3 = spyOn(component, 'sortInternalRows').and.callThrough();

    dEHCell.sortDir = SortDirection.desc;
    fixture.detectChanges();

    dEHCell.onSort(null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component._internalRows[0].id).toEqual(5);
    expect(component._internalRows[1].id).toEqual(12);
    expect(component._internalRows[2].id).toEqual(20);

    dEHCell.onSort(null);
    fixture.detectChanges();
    expect(component._internalRows[0].id).toEqual(20);
    expect(component._internalRows[1].id).toEqual(12);
    expect(component._internalRows[2].id).toEqual(5);
  });

  it('Deve ordenar internamente valores de data/hora', () => {
    const date1 = new Date(1978, 8, 5);
    const date2 = new Date(1980, 11, 1);
    const date3 = new Date(1995, 4, 3);
    const initialRows = [{ date: date2 }, { date: date1 }, { date: date3 }];

    const columns = [
      {
        prop: 'date',
      },
    ];

    component.sorts = { column: 'date', dir: 'desc' };
    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    const dEHCell = fixture.debugElement.query(
      By.directive(TableHeaderCellComponent),
    ).componentInstance;

    const spy = spyOn(dEHCell.sort, 'emit').and.callThrough();
    const spy2 = spyOn(component, 'onColumnSort').and.callThrough();
    const spy3 = spyOn(component, 'sortInternalRows').and.callThrough();

    dEHCell.sortDir = SortDirection.desc;
    fixture.detectChanges();

    dEHCell.onSort(null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component._internalRows[0].date).toEqual(date1);
    expect(component._internalRows[1].date).toEqual(date2);
    expect(component._internalRows[2].date).toEqual(date3);

    dEHCell.onSort(null);
    fixture.detectChanges();
    expect(component._internalRows[0].date).toEqual(date3);
    expect(component._internalRows[1].date).toEqual(date2);
    expect(component._internalRows[2].date).toEqual(date1);
  });

  it('Deve ordenar internamente valores de texto', () => {
    const texto1 = 'Agnaldo';
    const texto2 = 'Beatriz';
    const texto3 = 'Ronaldo';
    const initialRows = [{ name: texto2 }, { name: texto3 }, { name: texto1 }];

    const columns = [
      {
        prop: 'name',
      },
    ];

    component.sorts = { column: 'name', dir: 'desc' };
    component.rows = initialRows;
    component.columns = columns;
    fixture.detectChanges();

    const dEHCell = fixture.debugElement.query(
      By.directive(TableHeaderCellComponent),
    ).componentInstance;

    const spy = spyOn(dEHCell.sort, 'emit').and.callThrough();
    const spy2 = spyOn(component, 'onColumnSort').and.callThrough();
    const spy3 = spyOn(component, 'sortInternalRows').and.callThrough();

    dEHCell.sortDir = SortDirection.desc;
    fixture.detectChanges();

    dEHCell.onSort(null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component._internalRows[0].name).toEqual(texto1);
    expect(component._internalRows[1].name).toEqual(texto2);
    expect(component._internalRows[2].name).toEqual(texto3);

    dEHCell.onSort(null);
    fixture.detectChanges();
    expect(component._internalRows[0].name).toEqual(texto3);
    expect(component._internalRows[1].name).toEqual(texto2);
    expect(component._internalRows[2].name).toEqual(texto1);
  });

  describe('Inputs', () => {
    it('pageSizeOptions', () => {
      component.pageSizeOptions = [1, 2, 3];
      expect(component.pageSizeOptions).toEqual([1, 2, 3]);
    });

    it('clickableRows', () => {
      expect(component.clickableRows).toBeFalse();
      component.clickableRows = true;
      expect(component.clickableRows).toBeTrue();
    });
  });
});
