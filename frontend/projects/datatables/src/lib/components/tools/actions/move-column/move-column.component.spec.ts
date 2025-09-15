import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VrcIconModule } from '@vrsoftbr/vr-components';
import { take } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';
import posthog from 'posthog-js';
import { ETokens } from '../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../pipes/translator.pipe';
import { ToggleColumnComponent } from '../toggle-column/toggle-column.component';
import { IStorageColumn } from './../../../../interfaces/storage-column.interface';
import { EditColumnService } from './../../../../services/edit-column.service';
import { TableColumn } from './../../../../types/table-column.type';
import { MoveColumnComponent } from './move-column.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('MoveColumnComponent', () => {
  let component: MoveColumnComponent;
  let fixture: ComponentFixture<MoveColumnComponent>;

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
      imports: [VrcIconModule],
      declarations: [
        MoveColumnComponent,
        TranslatorPipe,
        ToggleColumnComponent,
      ],
      providers: [
        EditColumnService,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('O Input set columns deve indefinido', () => {
      expect(component.columns).toBeUndefined();
    });

    it('O Input set columns deve receber um parâmetro do tipo TableColumn[] e estar definido', () => {
      component.columns = [tableColumn];
      expect(component.columns).toBeDefined();
    });

    it('O Input set storageKeyMoveColumn deve indefinido', () => {
      expect(component.storageKeyMoveColumn).toBeUndefined();
    });

    it('O Input set storageKeyMoveColumn deve receber um parâmetro do tipo string e estar definido', () => {
      component.storageKeyMoveColumn = 'teste';
      expect(component.storageKeyMoveColumn).toBeDefined();
    });
  });

  describe('editColumn', () => {
    it('A função editColumn deve estar definido', () => {
      expect(component.editColumn).toBeDefined();
    });

    it('Ao acionar a função editColumn, a variável edit do tipo boolean deve ser o iverso do seu valor atual', () => {
      expect(component.edit).toBeFalsy();

      component.editColumn();
      component.isEditColumn.pipe(take(1)).subscribe((edit) => {
        expect(edit).toBeTruthy();
      });

      expect(component.edit).toBeTruthy();
    });
  });

  describe('getColumnsPosition', () => {
    it('A função getColumnsPosition deve estar definido', () => {
      expect(component.getColumnsPosition).toBeDefined();
    });

    it('Ao acionar a função getColumnsPosition, o retorno deve ser "name"', () => {
      component.columns = [tableColumn];

      expect(component.getColumnsPosition()).toEqual([
        {
          name: 'Name',
          prop: 'name',
          active: true,
        },
      ]);
    });

    it('A função getColumnsPosition retornar "name" para a variavel tempStorageColumns', () => {
      component.columns = [tableColumn];
      const moveColumnComponent: any = component;
      moveColumnComponent.tempStorageColumns = [
        { name: 'Name', prop: 'name', active: true },
      ];

      expect(component.getColumnsPosition()).toEqual([
        {
          name: 'Name',
          prop: 'name',
          active: true,
        },
      ]);
    });

    it('A função getColumnsPosition retornar "name" para a variavel _storageColumns', () => {
      component.columns = [tableColumn];
      const moveColumnComponent: any = component;
      moveColumnComponent._storageColumns = [
        { name: 'Name', prop: 'name', active: true },
      ];

      expect(component.getColumnsPosition()).toEqual([
        {
          name: 'Name',
          prop: 'name',
          active: true,
        },
      ]);
    });
  });

  describe('saveStorage', () => {
    it('A função saveStorage deve estar definido', () => {
      expect(component.getColumnsPosition).toBeDefined();
    });

    it('Ao acionar a função saveStorage, deve salvar no storage', () => {
      component.storageKeyMoveColumn = 'teste';

      component.columns = [tableColumn];

      let spy = spyOn(component, 'editColumn');

      spyOn(component, 'eventTrackingIdentifier').and.returnValue('teste');

      const spyPostHog = spyOn(posthog, 'capture');

      spyOn(component, 'getColumnsPosition').and.callFake(() => [
        { name: 'Teste', prop: 'teste', active: true },
      ]);

      spyOn(localStorage, 'setItem');
      spyOn(localStorage, 'removeItem');

      component.saveStorage();

      expect(spy).toHaveBeenCalled();
      expect(spyPostHog).toHaveBeenCalled();
    });

    it('Ao acionar a função saveStorage, não se key não estive definida deve salvar no storage', () => {
      component.columns = [tableColumn];

      expect(component.storageKeyMoveColumn).toBeUndefined();

      spyOn(posthog, 'capture');

      component.saveStorage();

      expect(component.edit).toBeFalsy();
    });
  });

  describe('getStorageColumns', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('A função deve estar definida', () => {
      const moveColumnComponent: any = component;

      expect(moveColumnComponent.getStorageColumns).toBeDefined();
    });

    it('A função deve retornar os valores do storage', () => {
      component.storageKeyMoveColumn = 'teste';
      component.columns = [tableColumn];

      const moveColumnComponent: any = component;

      const storage: IStorageColumn[] = [
        { name: 'Teste', prop: 'teste', active: true },
      ];

      localStorage.setItem('teste', btoa(JSON.stringify(storage)));

      expect(moveColumnComponent.getStorageColumns()).toEqual(storage);
    });

    it('A função deve retornar array vazio do storage', () => {
      component.storageKeyMoveColumn = 'teste';
      component.columns = [tableColumn];

      const moveColumnComponent: any = component;

      expect(moveColumnComponent.getStorageColumns()).toEqual([]);
    });
  });

  describe('eventToggleColumn', () => {
    it('A função deve estar definida', () => {
      const moveColumnComponent: any = component;

      expect(moveColumnComponent.eventToggleColumn).toBeDefined();
    });

    it('A função deve atribuir valor a variavel tempStorageColumns com valores vazios', () => {
      component.storageKeyMoveColumn = 'teste';
      component.columns = [tableColumn];

      const eventToggle: IStorageColumn = {
        name: 'Teste',
        prop: 'teste',
        active: true,
      };

      const moveColumnComponent: any = component;

      component.eventToggleColumn(eventToggle);

      expect(moveColumnComponent.tempStorageColumns).toEqual([eventToggle]);
    });

    it('A função deve atribuir valor a variavel tempStorageColumns com valores definidos', () => {
      component.storageKeyMoveColumn = 'teste';
      component.columns = [tableColumn];

      const eventToggle: IStorageColumn = {
        name: 'Teste',
        prop: 'teste',
        active: true,
      };

      const moveColumnComponent: any = component;

      moveColumnComponent.tempStorageColumns = [eventToggle];

      component.eventToggleColumn(eventToggle);

      expect(moveColumnComponent.tempStorageColumns).toEqual([eventToggle]);
    });
  });

  describe('resetToggleColumn', () => {
    it('A função deve estar definida', () => {
      const moveColumnComponent: any = component;

      expect(moveColumnComponent.resetToggleColumn).toBeDefined();
    });

    it('A função loadStorage deve estar chamada', () => {
      const moveColumnComponent: any = component;

      let spy = spyOn(moveColumnComponent, 'loadStorage');

      moveColumnComponent.resetToggleColumn();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('storageColumns', () => {
    it('A variavel deve estar definida', () => {
      const moveColumnComponent: any = component;

      expect(moveColumnComponent.storageColumns).toBeDefined();
    });

    describe('ngOnDestroy', () => {
      it('A função ngOnDestroy deve estar definida', () => {
        expect(component.ngOnDestroy).toBeDefined();
      });

      it('Ao acionar a função ngOnDestroy, todos os subscriptions devem ser desinscritos', () => {
        const subscriptionMock = jasmine.createSpyObj('Subscription', [
          'unsubscribe',
        ]);
        const moveColumnComponent: any = component;

        moveColumnComponent._subs = [subscriptionMock, subscriptionMock];

        component.ngOnDestroy();

        expect(subscriptionMock.unsubscribe).toHaveBeenCalledTimes(2);
      });
    });
  });
});
