import { IStorageColumn } from '../interfaces/storage-column.interface';
import { translateTemplates } from './column-helper';
import { setColumnDefaults } from './column-helper';
import { getStorageMatchColumns } from './column-helper';

describe('translateTemplates', () => {
  it('should translate templates correctly', () => {
    const templates: any[] = [
      {
        prop: 'name',
        headerTemplate: '<ng-template></ng-template>',
        cellTemplate: '<ng-template></ng-template>',
        treeToggleTemplate: '<ng-template></ng-template>',
        summaryFunc: () => {},
        summaryTemplate: '<ng-template></ng-template>',
        label: 'Name',
        columnGroup: 'Group 1',
        summaryValue: 'Summary value',
      },
      {
        prop: 'age',
        headerTemplate: '<ng-template></ng-template>',
        cellTemplate: '<ng-template></ng-template>',
        label: 'Age',
      },
      {
        prop: 'email',
        headerTemplate: '<ng-template></ng-template>',
        cellTemplate: '<ng-template></ng-template>',
        label: 'Email',
      },
    ];

    const result = translateTemplates(templates);

    expect(result.length).toBe(3);

    expect(result[0].prop).toBe('name');
    expect(result[0].headerTemplate).toBe('<ng-template></ng-template>');
    expect(result[0].cellTemplate).toBe('<ng-template></ng-template>');
    expect(result[0].treeToggleTemplate).toBe('<ng-template></ng-template>');
    expect(result[0].summaryFunc).toBeDefined();
    expect(result[0].summaryTemplate).toBe('<ng-template></ng-template>');
    expect(result[0].label).toBe('Name');
    expect(result[0].columnGroup).toBe('Group 1');
    expect(result[0].summaryValue).toBe('Summary value');

    expect(result[1].prop).toBe('age');
    expect(result[1].headerTemplate).toBe('<ng-template></ng-template>');
    expect(result[1].cellTemplate).toBe('<ng-template></ng-template>');
    expect(result[1].treeToggleTemplate).toBeUndefined();
    expect(result[1].summaryFunc).toBeUndefined();
    expect(result[1].summaryTemplate).toBeUndefined();
    expect(result[1].label).toBe('Age');
    expect(result[1].columnGroup).toBeUndefined();
    expect(result[1].summaryValue).toBeUndefined();

    expect(result[2].prop).toBe('email');
    expect(result[2].headerTemplate).toBe('<ng-template></ng-template>');
    expect(result[2].cellTemplate).toBe('<ng-template></ng-template>');
    expect(result[2].treeToggleTemplate).toBeUndefined();
    expect(result[2].summaryFunc).toBeUndefined();
    expect(result[2].summaryTemplate).toBeUndefined();
    expect(result[2].label).toBe('Email');
    expect(result[2].columnGroup).toBeUndefined();
    expect(result[2].summaryValue).toBeUndefined();
  });

  it('should handle empty templates array', () => {
    const templates: any[] = [];

    const result = translateTemplates(templates);

    expect(result.length).toBe(0);
  });
});

describe('getStorageMatchColumns', () => {
  it('should return columns that match the storage columns', () => {
    const storageColumns: IStorageColumn[] = [
      { name: 'name', prop: 'name', active: true },
      { name: 'age', prop: 'age', active: false },
    ];

    const columns: any[] = [
      { name: 'name', prop: 'name', visibleColumn: false },
      { name: 'age', prop: 'age', visibleColumn: true },
      { name: 'email', prop: 'email', visibleColumn: true },
    ];

    const result = getStorageMatchColumns(storageColumns, columns);

    expect(result.length).toBe(3);

    expect(result[0].prop).toBe('name');
    expect(result[0].visibleColumn).toBe(true);

    expect(result[1].prop).toBe('age');
    expect(result[1].visibleColumn).toBe(false);
  });

  it('should return all columns if storageColumns is null', () => {
    const storageColumns: any = null;

    const columns: any[] = [
      { prop: 'name', visibleColumn: false },
      { prop: 'age', visibleColumn: true },
      { prop: 'email', visibleColumn: true },
    ];

    const result = getStorageMatchColumns(storageColumns, columns);

    expect(result.length).toBe(3);

    expect(result[0].prop).toBe('name');
    expect(result[0].visibleColumn).toBe(false);

    expect(result[1].prop).toBe('age');
    expect(result[1].visibleColumn).toBe(true);

    expect(result[2].prop).toBe('email');
    expect(result[2].visibleColumn).toBe(true);
  });

  it('should return columns that match the storage columns and handle case sensitivity', () => {
    const storageColumns: any[] = [
      { prop: 'Name', active: true },
      { prop: 'AGE', active: false },
    ];

    const columns: any[] = [
      { prop: 'name', visibleColumn: false },
      { prop: 'age', visibleColumn: true },
      { prop: 'email', visibleColumn: true },
    ];

    const result = getStorageMatchColumns(storageColumns, columns);

    expect(result.length).toBe(3);

    expect(result[0].prop).toBe('name');
    expect(result[0].visibleColumn).toBe(true);

    expect(result[1].prop).toBe('age');
    expect(result[1].visibleColumn).toBe(false);
  });

  it('should return columns that match the storage columns and handle showHiddenColumn flag', () => {
    const storageColumns: any[] = [
      { prop: 'name', active: true },
      { prop: 'age', active: false },
      { prop: 'email', active: false },
    ];

    const columns: any[] = [
      { prop: 'name', visibleColumn: false },
      { prop: 'age', visibleColumn: true },
      { prop: 'email', visibleColumn: true },
    ];

    const result = getStorageMatchColumns(storageColumns, columns, true);

    expect(result.length).toBe(3);

    expect(result[0].prop).toBe('name');
    expect(result[0].visibleColumn).toBe(true);

    expect(result[1].prop).toBe('age');
    expect(result[1].visibleColumn).toBe(false);
  });
});
describe('setColumnDefaults', () => {
  it('should set default values for columns', () => {
    const columns: any[] = [
      { name: 'name', prop: 'name' },
      { name: 'age', prop: 'age' },
      { name: 'email', prop: 'email' },
    ];

    setColumnDefaults(columns);

    expect(columns.length).toBe(3);

    expect(columns[0].$$id).toBeDefined();
    expect(columns[0].visibleColumn).toBe(true);
    expect(columns[0].hideColumn).toBe(true);
    expect(columns[0].prop).toBe('name');
    expect(columns[0].label).toBe('name');
    expect(columns[0].$$valueGetter).toBeDefined();
    expect(columns[0].name).toBe('name');
    expect(columns[0].resizeable).toBe(true);
    expect(columns[0].sortable).toBe(true);
    expect(columns[0].draggable).toBe(true);
    expect(columns[0].canAutoResize).toBe(true);
    expect(columns[0].width).toBe(9.375);
    expect(columns[0].isTreeColumn).toBe(false);

    expect(columns[1].$$id).toBeDefined();
    expect(columns[1].visibleColumn).toBe(true);
    expect(columns[1].hideColumn).toBe(true);
    expect(columns[1].prop).toBe('age');
    expect(columns[1].label).toBe('age');
    expect(columns[1].$$valueGetter).toBeDefined();
    expect(columns[1].name).toBe('age');
    expect(columns[1].resizeable).toBe(true);
    expect(columns[1].sortable).toBe(true);
    expect(columns[1].draggable).toBe(true);
    expect(columns[1].canAutoResize).toBe(true);
    expect(columns[1].width).toBe(9.375);
    expect(columns[1].isTreeColumn).toBe(false);

    expect(columns[2].$$id).toBeDefined();
    expect(columns[2].visibleColumn).toBe(true);
    expect(columns[2].hideColumn).toBe(true);
    expect(columns[2].prop).toBe('email');
    expect(columns[2].label).toBe('email');
    expect(columns[2].$$valueGetter).toBeDefined();
    expect(columns[2].name).toBe('email');
    expect(columns[2].resizeable).toBe(true);
    expect(columns[2].sortable).toBe(true);
    expect(columns[2].draggable).toBe(true);
    expect(columns[2].canAutoResize).toBe(true);
    expect(columns[2].width).toBe(9.375);
    expect(columns[2].isTreeColumn).toBe(false);
  });

  it('should handle columns with isTreeColumn property', () => {
    const columns: any[] = [
      { name: 'name', prop: 'name', isTreeColumn: true },
      { name: 'age', prop: 'age', isTreeColumn: false },
      { name: 'email', prop: 'email', isTreeColumn: false },
    ];

    setColumnDefaults(columns);

    expect(columns.length).toBe(3);

    expect(columns[0].isTreeColumn).toBe(true);
    expect(columns[1].isTreeColumn).toBe(false);
    expect(columns[2].isTreeColumn).toBe(false);
  });

  it('should handle columns without prop and name', () => {
    const columns: any[] = [
      { prop: 'name' },
      { prop: 'age' },
      { prop: 'email' },
    ];

    setColumnDefaults(columns);

    expect(columns.length).toBe(3);

    expect(columns[0].prop).toBe('name');
    expect(columns[0].label).toBeUndefined();
    expect(columns[0].name).toBe('Name');

    expect(columns[1].prop).toBe('age');
    expect(columns[1].label).toBeUndefined();
    expect(columns[1].name).toBe('Age');

    expect(columns[2].prop).toBe('email');
    expect(columns[2].label).toBeUndefined();
    expect(columns[2].name).toBe('Email');
  });

  it('should handle columns with null prop', () => {
    const columns: any[] = [
      { prop: null, name: 'name' },
      { prop: null, name: 'age' },
      { prop: null, name: 'email' },
    ];

    setColumnDefaults(columns);

    expect(columns.length).toBe(3);

    expect(columns[0].prop).toBe('name');
    expect(columns[0].label).toBe('name');
    expect(columns[0].name).toBe('name');

    expect(columns[1].prop).toBe('age');
    expect(columns[1].label).toBe('age');
    expect(columns[1].name).toBe('age');

    expect(columns[2].prop).toBe('email');
    expect(columns[2].label).toBe('email');
    expect(columns[2].name).toBe('email');
  });

  it('should handle columns with missing properties', () => {
    const columns: any[] = [
      { name: 'name' },
      { name: 'age' },
      { name: 'email' },
    ];

    setColumnDefaults(columns);

    expect(columns.length).toBe(3);

    expect(columns[0].$$id).toBeDefined();
    expect(columns[0].visibleColumn).toBe(true);
    expect(columns[0].hideColumn).toBe(true);
    expect(columns[0].prop).toBe('name');
    expect(columns[0].label).toBe('name');
    expect(columns[0].$$valueGetter).toBeDefined();
    expect(columns[0].name).toBe('name');
    expect(columns[0].resizeable).toBe(true);
    expect(columns[0].sortable).toBe(true);
    expect(columns[0].draggable).toBe(true);
    expect(columns[0].canAutoResize).toBe(true);
    expect(columns[0].width).toBe(9.375);
    expect(columns[0].isTreeColumn).toBe(false);

    expect(columns[1].$$id).toBeDefined();
    expect(columns[1].visibleColumn).toBe(true);
    expect(columns[1].hideColumn).toBe(true);
    expect(columns[1].prop).toBe('age');
    expect(columns[1].label).toBe('age');
    expect(columns[1].$$valueGetter).toBeDefined();
    expect(columns[1].name).toBe('age');
    expect(columns[1].resizeable).toBe(true);
    expect(columns[1].sortable).toBe(true);
    expect(columns[1].draggable).toBe(true);
    expect(columns[1].canAutoResize).toBe(true);
    expect(columns[1].width).toBe(9.375);
    expect(columns[1].isTreeColumn).toBe(false);

    expect(columns[2].$$id).toBeDefined();
    expect(columns[2].visibleColumn).toBe(true);
    expect(columns[2].hideColumn).toBe(true);
    expect(columns[2].prop).toBe('email');
    expect(columns[2].label).toBe('email');
    expect(columns[2].$$valueGetter).toBeDefined();
    expect(columns[2].name).toBe('email');
    expect(columns[2].resizeable).toBe(true);
    expect(columns[2].sortable).toBe(true);
    expect(columns[2].draggable).toBe(true);
    expect(columns[2].canAutoResize).toBe(true);
    expect(columns[2].width).toBe(9.375);
    expect(columns[2].isTreeColumn).toBe(false);
  });

  it('should handle empty columns array', () => {
    const columns: any[] = [];

    setColumnDefaults(columns);

    expect(columns.length).toBe(0);
  });

  it('should handle null columns', () => {
    const columns: any = null;

    setColumnDefaults(columns);

    expect(columns).toBeNull();
  });

  it('should handle columns with null prop and name', () => {
    const columns: any[] = [
      { prop: null, name: null },
      { prop: null, name: null },
      { prop: null, name: null },
    ];

    setColumnDefaults(columns);

    expect(columns.length).toBe(3);

    expect(columns[0].prop).toBeNull();
    expect(columns[0].label).toBeUndefined();
    expect(columns[0].name).toBe('');

    expect(columns[1].prop).toBeNull();
    expect(columns[1].label).toBeUndefined();
    expect(columns[1].name).toBe('');

    expect(columns[2].prop).toBeNull();
    expect(columns[2].label).toBeUndefined();
    expect(columns[2].name).toBe('');
  });
});
