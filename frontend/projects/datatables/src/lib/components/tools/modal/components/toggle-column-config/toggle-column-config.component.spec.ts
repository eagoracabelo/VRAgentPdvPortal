import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pipe, PipeTransform } from '@angular/core';
import { ETokens } from '../../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../../pipes/translator.pipe';
import { ModalConfig } from '../../config/modal-config';
import { ModalRef } from '../../references/modal-ref';
import { IStorageColumn } from './../../../../../interfaces/storage-column.interface';
import { TableColumn } from './../../../../../types/table-column.type';
import { ToggleColumnConfigComponent } from './toggle-column-config.component';

const storageColumns: IStorageColumn = {
  name: 'Name',
  prop: 'name',
  active: true,
  isDefaultVisible: true,
  draggable: true,
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
  isDefaultVisible: true,
  isTreeColumn: false,
  name: 'Name',
  prop: 'name',
  resizeable: true,
  sortable: true,
  width: 625,
  visibleColumn: true,
  hideColumn: true,
};
class MockModalConfig {
  data = {
    columns: [tableColumn],
    storage: [storageColumns],
  };
}

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('ToggleColumnConfigComponent', () => {
  let component: ToggleColumnConfigComponent;
  let fixture: ComponentFixture<ToggleColumnConfigComponent>;
  let config: ModalConfig<any>;
  let modal: ModalRef<any, IStorageColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleColumnConfigComponent, TranslatorPipe],
      providers: [
        ModalRef,
        { provide: ModalConfig, useClass: MockModalConfig },
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    }).compileComponents();

    config = TestBed.inject(ModalConfig);
    modal = TestBed.inject(ModalRef);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleColumnConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formatData', () => {
    it('A variavel columns deve estar definida e receber os valores passados pela função', () => {
      const toggleColumnConfigComponent: any = component;

      expect(toggleColumnConfigComponent.columns).toBeDefined();

      toggleColumnConfigComponent.formatData({
        data: { columns: [tableColumn] },
      });

      expect(toggleColumnConfigComponent.columns).toEqual([storageColumns]);
    });

    it('A variavel columns deve estar definida e o valor do array deve ser []', () => {
      const toggleColumnConfigComponent: any = component;

      expect(toggleColumnConfigComponent.columns).toBeDefined();

      toggleColumnConfigComponent.formatData({});

      expect(toggleColumnConfigComponent.columns).toEqual([]);
    });
  });

  describe('formatDataToStorage', () => {
    it('A variavel columns deve estar definida e receber os valores passados pela função', () => {
      const toggleColumnConfigComponent: any = component;

      expect(toggleColumnConfigComponent.formatDataToStorage).toBeDefined();

      expect(
        toggleColumnConfigComponent.formatDataToStorage(tableColumn),
      ).toEqual(storageColumns);
    });

    it('O data como parâmetro ao ser vazio deve retornar um obejto vazio', () => {
      const toggleColumnConfigComponent: any = component;

      config.data = undefined;

      expect(toggleColumnConfigComponent.formatDataToStorage({})).toEqual({});
    });

    it('Não deve conter o valor no storage', () => {
      const toggleColumnConfigComponent: any = component;

      expect(
        toggleColumnConfigComponent.formatDataToStorage({
          ...tableColumn,
          prop: 'teste',
        }),
      ).toEqual({ ...storageColumns, prop: 'teste', active: true });
    });
  });

  describe('isChecked', () => {
    it('A função "onEventSend" do modal deve ser chamada', () => {
      const event: any = { target: { checked: false } };

      const spy = spyOn(modal, 'onEventSend');

      component.isChecked(event, storageColumns);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('apply', () => {
    it('A função "ok" do modal deve ser chamada', () => {
      const spy = spyOn(modal, 'ok');

      component.apply();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('restoreDefault', () => {
    it('A função "ok" do modal deve ser chamada', () => {
      const spy = spyOn(modal, 'onEventSend');

      component.restoreDefault();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.columns[0].active).toEqual(true);
    });
  });

  describe('handleSelections', () => {
    it('Deve setar todas as colunas para o mesmo valor do ocultar/exibir colunas', () => {
      component.handleSelections(false);
      expect(component.columns[0].active).toEqual(false);
    });
  });

  describe('isHideColumn', () => {
    it('A função deve retornar false', () => {
      config.data = undefined;

      expect(component.isHideColumn({ ...storageColumns })).toBeFalse();
    });

    it('A função deve retornar true', () => {
      expect(component.isHideColumn({ ...storageColumns })).toBeTrue();
    });
  });
});
