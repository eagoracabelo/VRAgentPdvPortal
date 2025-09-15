import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';
import { ETokens } from '../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../pipes/translator.pipe';
import { ToggleColumnConfigComponent } from '../../modal/components/toggle-column-config/toggle-column-config.component';
import { IStorageColumn } from './../../../../interfaces/storage-column.interface';
import { TableColumn } from './../../../../types/table-column.type';
import { ToggleColumnComponent } from './toggle-column.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('ToggleColumnComponent', () => {
  let component: ToggleColumnComponent;
  let fixture: ComponentFixture<ToggleColumnComponent>;

  const storageColumns: IStorageColumn = {
    name: 'Id',
    prop: '_id',
    active: true,
  };

  const tableColumn: TableColumn = {
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
      declarations: [ToggleColumnComponent, TranslatorPipe],
      providers: [
        TranslatorPipe,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('O Input set storageColumns deve indefinido', () => {
      expect(component.storageColumns).toBeUndefined();
    });

    it('O Input set storageColumns deve receber um parâmetro do tipo IStorageColumn[] e estar definido', () => {
      component.storageColumns = [storageColumns];
      expect(component.storageColumns).toBeDefined();
    });

    it('O Input set columns deve indefinido', () => {
      expect(component.columns).toBeUndefined();
    });

    it('O Input set columns deve receber um parâmetro do tipo TableColumn[] e estar definido', () => {
      component.columns = [tableColumn];
      expect(component.columns).toBeDefined();
    });
  });

  describe('toggleColumn', () => {
    it('toggleColumn deve ser chamado', () => {
      const toggleColumnComponent: any = component;

      const spy = spyOn(toggleColumnComponent, 'modalInstance').and.callFake(
        () => {
          return {
            afterOk: of({
              ...tableColumn,
            }),
            onEvent: of(true),
            afterClosed: of(true),
          };
        },
      );

      toggleColumnComponent.toggleColumn();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('modalInstance', () => {
    it('Deve retornar uma instancia de ModalRef', () => {
      const toggleColumnComponent: any = component;

      const ref = toggleColumnComponent.modalInstance(
        ToggleColumnConfigComponent,
      );

      ref.ok(tableColumn);

      expect(ref).toBeDefined();
    });
  });

  afterAll(() => {
    component.ngOnDestroy();
  });
});
