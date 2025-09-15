import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FactoryOpts } from 'imask';
import { EditColumnService } from './../../../../services/edit-column.service';

import { TableColumn } from '../../../../types/table-column.type';
import { TipoDadoColuna } from '../../../../types/tipo-dado-coluna.type';
import { setColumnDefaults } from '../../../../utils/column-helper';
import { shallowValueGetter } from '../../../../utils/column-prop-getters';
import { DataTableBodyCellComponent } from './body-cell.component';

class DataType {
  id: number | string;
  padStart: number | string;
  numerico: number;
  texto: string;
  inteiro: number;
  cep: string;
  cpf: string;
  cnpj: string;
  ncm: string;
  mercadologico: string;
  data: string;
  hora: string;
  dataHora: string;
  telefone: string;
  customizado: string;

  constructor(
    id: number | string,
    padStart: number | string,
    numerico: number,
    texto: string,
    inteiro: number,
    cep: string,
    cpf: string,
    cnpj: string,
    ncm: string,
    mercadologico: string,
    data: string,
    hora: string,
    dataHora: string,
    telefone: string,
    customizado: string,
  ) {
    this.id = id;
    this.padStart = padStart;
    this.numerico = numerico;
    this.texto = texto;
    this.inteiro = inteiro;
    this.cep = cep;
    this.cpf = cpf;
    this.cnpj = cnpj;
    this.ncm = ncm;
    this.mercadologico = mercadologico;
    this.data = data;
    this.hora = hora;
    this.dataHora = dataHora;
    this.telefone = telefone;
    this.customizado = customizado;
  }
}

const row: DataType = new DataType(
  123.2,
  '',
  1,
  'Texto',
  1,
  '13506770',
  '44425743830',
  '08076873000190',
  '12345678',
  '123456789',
  '21102021',
  '1530',
  '211020211530',
  '19999999999',
  '1270010000',
);

const col: TableColumn = {
  width: 150,
  minWidth: 150,
  maxWidth: 150,
  sortable: true,
  resizeable: true,
  name: 'Numerico',
  prop: 'numerico',
  $$valueGetter: shallowValueGetter as any,
  isTreeColumn: false,
  draggable: true,
  canAutoResize: true,
  $$oldWidth: 150,
  $$id: 'a294',
  visibleColumn: true,
};

describe('DataTableBodyCellComponent', () => {
  let fixture: ComponentFixture<DataTableBodyCellComponent>;
  let component: DataTableBodyCellComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableBodyCellComponent],
      providers: [EditColumnService],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableBodyCellComponent);
      component = fixture.componentInstance;

      component.rowHeight = 15;
      component.isSelected = false;
      component.expanded = false;
      component.rowIndex = 0;
      component.group = undefined;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('column input', () => {
    it('should receive a column object', () => {
      component.column = col;
      setColumnDefaults([col]);

      expect(component.column).toBeDefined();
      expect(component.column.$$valueGetter).toBe(shallowValueGetter);
      expect(component.width).toBe(col.width);
      expect(component.minWidth).toBe(col.minWidth);
      expect(component.maxWidth).toBe(col.maxWidth);
      expect(component.height).toBe(`${component.rowHeight}rem`);
    });
  });

  describe('Should match al column data types', () => {
    it('should be numeric column', () => {
      const numericColumn: TableColumn = {
        dataType: 'numerico',
        name: 'Numerico',
        prop: 'numerico',
        $$id: 'number123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(numericColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'numerico',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.numerico.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.numerico.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be text column', () => {
      const textColumn: TableColumn = {
        dataType: 'texto',
        name: 'Texto',
        prop: 'texto',
        $$id: 'text123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(textColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'texto',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.texto.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.texto.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be integer column', () => {
      const integerColumn: TableColumn = {
        dataType: 'inteiro',
        name: 'Inteiro',
        prop: 'inteiro',
        $$id: 'integer123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(integerColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'inteiro',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.inteiro.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.inteiro.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be CEP column', () => {
      const cepColumn: TableColumn = {
        dataType: 'cep',
        name: 'CEP',
        prop: 'cep',
        $$id: 'cep123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(cepColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'cep',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.cep.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.cep.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be CPF column', () => {
      const cpfColumn: TableColumn = {
        dataType: 'cpf',
        name: 'CPF',
        prop: 'cpf',
        $$id: 'cpf123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(cpfColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'cpf',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.cpf.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.cpf.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be CNPJ column', () => {
      const cnpjColumn: TableColumn = {
        dataType: 'cnpj',
        name: 'CNPJ',
        prop: 'cnpj',
        $$id: 'cnpj123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(cnpjColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'cnpj',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.cnpj.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.cnpj.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be NCM column', () => {
      const ncmColumn: TableColumn = {
        dataType: 'ncm',
        name: 'NCM',
        prop: 'ncm',
        $$id: 'ncm123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(ncmColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'ncm',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.ncm.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.ncm.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be Mercadologico column', () => {
      const mercadologicoColumn: TableColumn = {
        dataType: 'mercadologico',
        name: 'Mercadologico',
        prop: 'mercadologico',
        $$id: 'mercadologico123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(mercadologicoColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'mercadologico',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.mercadologico.mascara);
      expect(component.textAlign).toEqual(
        TipoDadoColuna.mercadologico.alinhamento,
      );
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be Data column', () => {
      const dataColumn: TableColumn = {
        dataType: 'data',
        name: 'Data',
        prop: 'data',
        $$id: 'data123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(dataColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'data',
          dir: 'asc',
        },
      ];

      expect(JSON.stringify(component.mascara)).toEqual(
        JSON.stringify(TipoDadoColuna.data.mascara),
      );
      expect(component.textAlign).toEqual(TipoDadoColuna.data.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be Hora column', () => {
      const horaColumn: TableColumn = {
        dataType: 'hora',
        name: 'Hora',
        prop: 'hora',
        $$id: 'hora123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(horaColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'hora',
          dir: 'asc',
        },
      ];

      expect(JSON.stringify(component.mascara)).toEqual(
        JSON.stringify(TipoDadoColuna.hora.mascara),
      );
      expect(component.textAlign).toEqual(TipoDadoColuna.hora.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be Data/Hora column', () => {
      const dataHoraColumn: TableColumn = {
        dataType: 'dataHora',
        name: 'Data/Hora',
        prop: 'dataHora',
        $$id: 'dataHora123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.column = Object.assign(dataHoraColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'dataHora',
          dir: 'asc',
        },
      ];

      expect(JSON.stringify(component.mascara)).toEqual(
        JSON.stringify(TipoDadoColuna.dataHora.mascara),
      );
      expect(component.textAlign).toEqual(TipoDadoColuna.dataHora.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be Telefone column', () => {
      const telefoneColumn: TableColumn = {
        dataType: 'telefone',
        name: 'Telefone',
        prop: 'telefone',
        $$id: 'telefone123',
        visibleColumn: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      component.row = row;
      component.column = Object.assign(telefoneColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'telefone',
          dir: 'asc',
        },
      ];

      expect(component.mascara).toEqual(TipoDadoColuna.telefone.mascara);
      expect(component.textAlign).toEqual(TipoDadoColuna.telefone.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });

    it('should be Custom Numeric column', () => {
      const expectedMask: FactoryOpts = {
        mask: '0.0.0.0',
        autofix: true,
        lazy: true,
        overwrite: true,
      };

      const spy = spyOn(component, 'calcSortDir');

      const customizadoColumn: TableColumn = {
        dataType: 'numerico',
        dataCustomMask: expectedMask,
        name: 'Custom Numeric',
        prop: 'customizado',
        $$id: 'customizado123',
        visibleColumn: true,
      };

      component.column = Object.assign(customizadoColumn, col);
      setColumnDefaults([component.column]);

      component.sorts = [
        {
          prop: 'customizado',
          dir: 'asc',
        },
      ];

      expect((component.mascara as any).mask).toBe(expectedMask.mask);
      expect(component.textAlign).toEqual(TipoDadoColuna.numerico.alinhamento);
      expect(spy).toHaveBeenCalledWith(component.sorts);
    });
  });
});
