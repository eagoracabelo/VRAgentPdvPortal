/* eslint-disable */
import { DataTableColumnDirective } from '../components/columns/column.directive';
import { IStorageColumn } from '../interfaces/storage-column.interface';
import { TableColumn } from '../types/table-column.type';
import { camelCase, deCamelCase } from './camel-case';
import { getterForProp } from './column-prop-getters';
import { id } from './id';

function isNotPropertyOrUndefined(
  column: TableColumn,
  prop: keyof TableColumn,
): boolean {
  return (
    !column.hasOwnProperty(prop) ||
    (column.hasOwnProperty(prop) && column[prop] === undefined)
  );
}

/**
 * Sets the column defaults
 */
export function setColumnDefaults(columns: TableColumn[]): void {
  if (!columns) return;

  // Only one column should hold the tree view
  // Thus if multiple columns are provided with
  // isTreeColumn as true we take only the first one
  let treeColumnFound = false;

  for (const column of columns) {
    if (!column.$$id) {
      column.$$id = id();
    }

    if (isNotPropertyOrUndefined(column, 'visibleColumn')) {
      column.visibleColumn = true;
    }

    if (isNotPropertyOrUndefined(column, 'hideColumn')) {
      column.hideColumn = true;
    }

    // prop can be numeric; zero is valid not a missing prop
    // translate name => prop
    if (isNullOrUndefined(column.prop) && column.name) {
      column.prop = camelCase(column.name);
    }

    if (isNullOrUndefined(column.label) && column.name) {
      column.label = camelCase(column.name);
    }

    if (!column.$$valueGetter) {
      column.$$valueGetter = column.prop
        ? getterForProp(column.prop)
        : undefined;
    }

    // format props if no name passed
    if (!isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = deCamelCase(String(column.prop));
    }

    if (isNullOrUndefined(column.prop) && isNullOrUndefined(column.name)) {
      column.name = ''; // Fixes IE and Edge displaying `null`
    }

    if (isNotPropertyOrUndefined(column, 'resizeable')) {
      column.resizeable = true;
    }

    if (isNotPropertyOrUndefined(column, 'sortable')) {
      column.sortable = true;
    }

    if (isNotPropertyOrUndefined(column, 'draggable')) {
      column.draggable = true;
    }

    if (isNotPropertyOrUndefined(column, 'canAutoResize')) {
      column.canAutoResize = true;
    }

    if (isNotPropertyOrUndefined(column, 'width')) {
      column.width = 9.375;
    }

    if (isNotPropertyOrUndefined(column, 'isTreeColumn')) {
      column.isTreeColumn = false;
    } else {
      if (column.isTreeColumn && !treeColumnFound) {
        // If the first column with isTreeColumn is true found
        // we mark that treeCoulmn is found
        treeColumnFound = true;
      } else {
        // After that isTreeColumn property for any other column
        // will be set as false
        column.isTreeColumn = false;
      }
    }
  }
}

export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Translates templates definitions to objects
 */
export function translateTemplates(
  templates: DataTableColumnDirective[] | any,
): any[] {
  const result: any[] = [];
  for (const temp of templates) {
    const col: any = {};

    const props = Object.getOwnPropertyNames(temp);
    for (const prop of props) {
      col[prop] = temp[prop];
    }

    if (temp.headerTemplate) {
      col.headerTemplate = temp.headerTemplate;
    }

    if (temp.cellTemplate) {
      col.cellTemplate = temp.cellTemplate;
    }

    if (temp.treeToggleTemplate) {
      col.treeToggleTemplate = temp.treeToggleTemplate;
    }

    if (temp.summaryFunc) {
      col.summaryFunc = temp.summaryFunc;
    }

    if (temp.summaryTemplate) {
      col.summaryTemplate = temp.summaryTemplate;
    }

    if (temp.label) {
      col.label = temp.label;
    }

    if (temp.columnGroup) {
      col.columnGroup = temp.columnGroup;
    }

    if (temp.summaryValue) {
      col.summaryValue = temp.summaryValue;
    }

    result.push(col);
  }

  return result;
}

export function getStorageMatchColumns(
  storageColumns: IStorageColumn[],
  columns: TableColumn[],
  showHiddenColumn = false,
): TableColumn[] {
  if (!storageColumns) {
    return columns;
  }

  const matchColumns: TableColumn[] = [];
  for (const storageColumn of storageColumns) {
    const col = columns.find(
      (c) =>
        c.prop?.toString().toLocaleLowerCase() ===
        storageColumn?.prop?.toString().toLocaleLowerCase(),
    );

    if (col) {
      col.visibleColumn = storageColumn.active;
      matchColumns.push(col);
    }
  }

  if (columns.length === matchColumns.length) {
    return matchColumns;
  }

  return getStorageNotMatchColumns(columns, matchColumns);
}

export function getStorageNotMatchColumns(
  columns: TableColumn[],
  matchedColumns: TableColumn[],
): TableColumn[] {
  for (const column of columns) {
    if (!matchedColumns.includes(column)) {
      column.visibleColumn = false;
      matchedColumns.push(column);
    }
  }

  return matchedColumns;
}
