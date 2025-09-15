import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { take } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';
import { DataTableHeaderCellComponent } from '../../public-api';
import { ETokens } from '../enums/tokens.enum';
import { ColumnChangesService } from '../services/column-changes.service';
import { DimensionsHelper } from '../services/dimensions-helper.service';
import { ScrollbarHelper } from '../services/scrollbar-helper.service';
import { SortDirection } from '../types/sort-direction.type';
import { VrcDatatablesModule } from '../vrc-datatables.module';
import { DataTableBodyComponent } from './body/body.component';
import { DatatableComponent } from './datatable.component';

let fixture: ComponentFixture<any>;
let component: any;
let dimensionsHelper: DimensionsHelper;

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('DatatableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScrollbarHelper,
        DimensionsHelper,
        ColumnChangesService,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
      imports: [VrcDatatablesModule],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DatatableComponent);
      component = fixture.componentInstance;
      dimensionsHelper = TestBed.inject(DimensionsHelper);

      component.scrollbarH = 100;
      component.externalSorting = false;
      component.headerHeight = 50;
      component.footerHeight = 50;
      component.rowHeight = 'auto';
    });
  }));

  it('component should be defined', () => {
    expect(component).toBeDefined();
  });

  it('Deve enviar as informações das linhas do DataTableComponent para o DataTableBodyComponent', () => {
    const initialRows = [
      { id: 5, user: 'Sam', age: 35 },
      { id: 20, user: 'Bob', age: 50 },
      { id: 12, user: 'Joe', age: 60 },
    ];

    component.rows = initialRows;
    component.columnTwoProp = 'user';
    fixture.detectChanges();

    const dEBody = fixture.debugElement.query(
      By.directive(DataTableBodyComponent),
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
      By.directive(DataTableHeaderCellComponent),
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
      By.directive(DataTableHeaderCellComponent),
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
      By.directive(DataTableHeaderCellComponent),
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

  it('Deve alterar a ordem das colunas que sao arrastaveis', () => {
    const columns = [
      {
        prop: '_id',
        label: 'id',
        draggable: false,
      },
      {
        prop: 'nome',
        label: 'nome',
        draggable: true,
      },
      {
        prop: 'idade',
        label: 'idade',
        draggable: true,
      },
    ];
    const params = { column: columns[2], newValue: 1, prevValue: 2 };
    component._internalColumns = columns;

    fixture.detectChanges();

    component.onColumnReorder(params);

    expect(component._internalColumns[0].prop).toEqual('_id');
    expect(component._internalColumns[1].prop).toEqual('idade');
    expect(component._internalColumns[2].prop).toEqual('nome');
  });

  it('Nao deve alterar a ordem das colunas que nao sao arrastaveis', () => {
    const columns = [
      {
        prop: '_id',
        label: 'id',
        draggable: false,
      },
      {
        prop: 'nome',
        label: 'nome',
        draggable: true,
      },
      {
        prop: 'idade',
        label: 'idade',
        draggable: true,
      },
    ];
    const params = { column: columns[1], newValue: 0, prevValue: 1 };
    component._internalColumns = columns;

    fixture.detectChanges();

    component.onColumnReorder(params);

    expect(component._internalColumns[0].prop).toEqual('_id');
    expect(component._internalColumns[1].prop).toEqual('nome');
    expect(component._internalColumns[2].prop).toEqual('idade');
  });

  it('Deve verificar a variavel sortHeaderIcons ao iniciar o componente', () => {
    const testSortHeaderIcon = {
      sortAscending: 'seta_cima',
      sortDescending: 'seta_baixo',
    };
    expect(component.sortHeaderIcons).toEqual(testSortHeaderIcon);
  });

  describe('Inputs', () => {
    it('pageSizeOptions', () => {
      component.pageSizeOptions = [1, 2, 3];
      expect(component.pageSizeOptions).toEqual([1, 2, 3]);
    });

    it('filter', () => {
      expect(component.filter).toEqual({});
      const filter = { teste: 'teste' };
      component.filter = filter;
      expect(component.filter).toEqual(filter);
    });

    it('isEditColumn', () => {
      expect(component.isEditColumn).toBeFalse();
      component.isEditColumn = true;
      expect(component.isEditColumn).toBeTrue();
    });

    it('clickableRows', () => {
      expect(component.clickableRows).toBeFalse();
      component.clickableRows = true;
      expect(component.clickableRows).toBeTrue();
    });
  });

  describe('Outputs', () => {
    it('editColumn', () => {
      expect(component.isEditColumn).toBeFalse();
      expect(component.editColumn).toBeDefined();
      component.editColumn(true);
      expect(component.isEditColumn).toBeTrue();
    });

    it('pageSizeLimit', () => {
      component.page.pipe(take(1)).subscribe((page: unknown) => {
        expect(page).toEqual({
          count: 0,
          pageSize: 1,
          limit: 1,
          offset: 0,
          filter: {},
          order: {},
        });
      });

      component.pageSizeLimit(1);
      expect(component.limit).toEqual(1);
    });
  });

  describe('onResetSelected', () => {
    it('should set selected to empty', () => {
      component.selected = [{ teste: 1 }];
      component.onResetSelected();
      expect(component.selected).toHaveSize(0);
    });
  });

  describe('onWindowResize', () => {
    it('should be called if exists dimensions on view', () => {
      const spy = spyOn(component, 'recalculate').and.callThrough();
      spyOn(dimensionsHelper, 'getDimensions').and.returnValue({
        width: 100,
        height: 100,
      } as any);
      component.onWindowResize();
      expect(spy).toHaveBeenCalled();
    });

    it('should be not called if not exists dimensions on view', () => {
      const spy = spyOn(component, 'recalculate').and.callThrough();
      spyOn(dimensionsHelper, 'getDimensions').and.returnValue({
        width: 0,
        height: 0,
      } as any);
      component.onWindowResize();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('forceCalculateColumns', () => {
    it('should be called if exists dimensions on view', fakeAsync(() => {
      const spy = spyOn(component, 'recalculate').and.callThrough();
      const spy2 = spyOn(component, 'onBodyScroll').and.callThrough();
      component.scrollbarH = false;
      component.scrollbarV = false;

      spyOn(dimensionsHelper, 'getDimensions').and.returnValue({
        width: 100,
        height: 100,
      } as any);
      component.forceCalculateColumns = true;

      tick(100);
      expect(spy).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    }));

    it('should be called if exists dimensions on view and scroll acitve', fakeAsync(() => {
      const spy = spyOn(component, 'recalculate').and.callThrough();
      const spy2 = spyOn(component, 'onBodyScroll').and.callThrough();
      component.scrollbarH = true;
      component.scrollbarV = true;

      spyOn(dimensionsHelper, 'getDimensions').and.returnValue({
        width: 100,
        height: 100,
      } as any);
      component.forceCalculateColumns = true;

      tick(100);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    }));

    it('should be not called if not exists dimensions on view', fakeAsync(() => {
      const spy = spyOn(component, 'recalculate').and.callThrough();
      const spy2 = spyOn(component, 'onBodyScroll').and.callThrough();
      component.scrollbarH = true;
      component.scrollbarV = true;
      spyOn(dimensionsHelper, 'getDimensions').and.returnValue({
        width: 0,
        height: 0,
      } as any);

      component.forceCalculateColumns = true;

      tick(100);
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    }));
  });

  describe('recalculateDims', () => {
    it('should recalculate dimensions in (REM)', () => {
      const htmlFontSize = 16;
      const dimensions = { width: 800, height: 600 };
      const toolsHeight = 50;

      spyOn(dimensionsHelper, 'getHTMLFontSize').and.returnValue(htmlFontSize);
      spyOn(dimensionsHelper, 'getDimensions').and.returnValue(
        dimensions as any,
      );
      spyOn(dimensionsHelper, 'getHeight').and.returnValue(
        (headerHeight: number, footerHeight: number) => {
          return headerHeight + footerHeight;
        },
      );
      spyOn(dimensionsHelper, 'getToolsHeight').and.returnValue(toolsHeight);

      component.headerHeight = 100;
      component.footerHeight = 50;
      component.scrollbarV = true;
      component.showToolsBar = true;

      component.recalculateDims();

      expect(dimensionsHelper.getHTMLFontSize).toHaveBeenCalled();
      expect(dimensionsHelper.getDimensions).toHaveBeenCalledWith(
        component.element,
      );
      expect(dimensionsHelper.getHeight).toHaveBeenCalled();
      expect(dimensionsHelper.getToolsHeight).toHaveBeenCalledWith(
        component.element,
      );

      expect(component._innerWidth).toEqual(dimensions.width / htmlFontSize);
    });
  });

  describe('updateColumns', () => {
    it('should update columns with summary values', () => {
      const colArray = [{ name: 'col1' }, { name: 'col2' }] as any[];

      const arr = [
        {
          name: 'col1',
          label: 'Label 1',
          columnGroup: 'Group 1',
          summaryValue: 'Value 1',
        },
        {
          name: 'col2',
          label: 'Label 2',
          columnGroup: 'Group 2',
          summaryValue: 'Value 2',
        },
      ];

      component.updateColumns(colArray, arr);

      expect(colArray).toEqual([
        {
          name: 'col1',
          label: 'Label 1',
          columnGroup: 'Group 1',
          summaryValue: 'Value 1',
        },
        {
          name: 'col2',
          label: 'Label 2',
          columnGroup: 'Group 2',
          summaryValue: 'Value 2',
        },
      ]);
    });

    it('should not update columns if no summary values found', () => {
      const colArray = [{ name: 'col1' }, { name: 'col2' }] as any[];

      const arr = [
        {
          name: 'col3',
          label: 'Label 3',
          columnGroup: 'Group 3',
          summaryValue: 'Value 3',
        },
      ];

      component.updateColumns(colArray, arr);

      expect(colArray).toEqual([{ name: 'col1' }, { name: 'col2' }]);
    });

    it('should handle empty colArray gracefully', () => {
      const colArray: any[] = [];
      const arr = [
        {
          name: 'col1',
          label: 'Label 1',
          columnGroup: 'Group 1',
          summaryValue: 'Value 1',
        },
      ];

      component.updateColumns(colArray, arr);

      expect(colArray).toEqual([]);
    });

    it('should handle empty arr gracefully', () => {
      const colArray = [{ name: 'col1' }, { name: 'col2' }] as any[];
      const arr: any[] = [];

      component.updateColumns(colArray, arr);

      expect(colArray).toEqual([{ name: 'col1' }, { name: 'col2' }]);
    });
  });
});
