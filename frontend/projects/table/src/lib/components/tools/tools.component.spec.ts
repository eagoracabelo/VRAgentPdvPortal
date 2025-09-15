import { ComponentFixture, TestBed } from '@angular/core/testing';
import { take } from 'rxjs';

import { TranslatePipe } from '../../pipes/translate.pipe';
import { TableColumn } from './../../types/table-column.type';
import { ExportFileComponent } from './actions/export-file/export-file.component';
import { TableToolsComponent } from './tools.component';

describe('TableToolsComponent', () => {
  let component: TableToolsComponent;
  let fixture: ComponentFixture<TableToolsComponent>;

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
    name: 'Name',
    prop: 'name',
    resizeable: true,
    sortable: true,
    width: 39.0625,
    visibleColumn: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableToolsComponent, ExportFileComponent, TranslatePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableToolsComponent);
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

    it('translation', () => {
      expect(component.translation).toBeUndefined();

      component.translation = 'pt-BR';

      expect(component.translation).toEqual('pt-BR');
    });
  });

  describe('Output', () => {
    it('onPageSizeChange', () => {
      component.pageSizeChange.pipe(take(1)).subscribe((val) => {
        expect(val).toEqual('teste');
      });

      component.onPageSizeChange('teste');

      expect(component.onPageSizeChange).toBeDefined();
    });
  });
});
