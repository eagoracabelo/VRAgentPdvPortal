import { ComponentFixture, TestBed } from '@angular/core/testing';
import { take } from 'rxjs';

import { TranslatorPipe } from '../../pipes/translator.pipe';
import { TableColumn } from './../../types/table-column.type';
import { ExportFileComponent } from './actions/export-file/export-file.component';
import { FireEventSelectedComponent } from './actions/fire-event-selected/fire-event-selected.component';
import { MoveColumnComponent } from './actions/move-column/move-column.component';
import { PageSizeComponent } from './actions/page-size/page-size.component';
import { DataTableToolsComponent } from './tools.component';

describe('DataTableToolsComponent', () => {
  let component: DataTableToolsComponent;
  let fixture: ComponentFixture<DataTableToolsComponent>;

  const rows = [
    {
      age: 22,
      company: 'Johnson, Johnson and Partners, LLC CMP DDC',
      gender: 'female',
      name: 'Ethel Price',
    },
  ];

  const columns: TableColumn = {
    $$id: 'g3lp',
    $$oldWidth: 150,
    $$valueGetter: (obj: any, fieldName: any) => {
      if (obj == null) {
        return '';
      }

      if (!obj || !fieldName) {
        return obj;
      }

      const value = obj[fieldName];

      if (value == null) {
        return '';
      }

      return value;
    },
    canAutoResize: true,
    draggable: true,
    isTreeColumn: false,
    name: 'Name',
    prop: 'name',
    resizeable: true,
    sortable: true,
    width: 625,
    visibleColumn: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DataTableToolsComponent,
        PageSizeComponent,
        MoveColumnComponent,
        ExportFileComponent,
        FireEventSelectedComponent,
        TranslatorPipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableToolsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input', () => {
    it('rows', () => {
      expect(component.rows).toBeUndefined();

      component.rows = rows;

      expect(component.rows).toEqual(rows);
    });

    it('columns', () => {
      expect(component.columns).toBeUndefined();

      component.columns = [columns];

      expect(component.columns).toEqual([columns]);
    });

    it('activeMoveColumn', () => {
      expect(component.activeMoveColumn).toBeFalsy();

      component.activeMoveColumn = true;

      expect(component.activeMoveColumn).toBeTruthy();
    });

    it('storageKeyMoveColumn', () => {
      expect(component.storageKeyMoveColumn).toBeUndefined();

      component.storageKeyMoveColumn = 'teste';

      expect(component.storageKeyMoveColumn).toEqual('teste');
    });
  });

  describe('Output', () => {
    it('editColumn', () => {
      component.isEditColumn.pipe(take(1)).subscribe((val) => {
        expect(val).toBeFalsy();
      });

      component.editColumn(false);

      expect(component.editColumn).toBeDefined();
    });

    it('onPageSizeChange', () => {
      component.pageSizeChange.pipe(take(1)).subscribe((val) => {
        expect(val).toEqual('teste');
      });

      component.onPageSizeChange('teste');

      expect(component.onPageSizeChange).toBeDefined();
    });

    it('onReloadData', () => {
      component.reloadData.pipe(take(1)).subscribe((val) => {
        expect(val).toEqual(true);
      });

      component.onReloadData(true);

      expect(component.onReloadData).toBeDefined();
    });

    it('onResetSelected', () => {
      component.onResetSelected();
      expect(component.onResetSelected).toBeDefined();
    });
  });
});
