import { PipeTransform, Signal } from '@angular/core';
import { TableColumn as ITableColumn } from '@vrsoftbr/vr-file-export/shared/table-column.type';
import { FactoryOpts } from 'imask';

import { ValueGetter } from '../utils/column-prop-getters';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Column property that indicates how to retrieve this column's
 * value from a row.
 * 'a.deep.value', 'normalprop', 0 (numeric)
 */
export type TableColumnProp = string | number;

/**
 * Column Type
 */
export interface TableColumn extends ITableColumn {
  /**
   * Internal unique id
   *
   * @memberOf TableColumn
   */
  $$id?: string;

  /**
   * Internal for column width distributions
   *
   * @memberOf TableColumn
   */
  $$oldWidth?: number;

  /**
   * Internal for setColumnDefaults
   *
   * @memberOf TableColumn
   */
  $$valueGetter?: ValueGetter;

  /**
   * Determines if column is checkbox
   *
   * @memberOf TableColumn
   */
  checkboxable?: boolean;

  /**
   * Determines if the column is frozen to the left
   *
   * @memberOf TableColumn
   */
  frozenLeft?: boolean;

  /**
   * Determines if the column is frozen to the right
   *
   * @memberOf TableColumn
   */
  frozenRight?: boolean;

  /**
   * The grow factor relative to other columns. Same as the flex-grow
   * API from http =//www.w3.org/TR/css3-flexbox/. Basically;
   * take any available extra width and distribute it proportionally
   * according to all columns' flexGrow values.
   *
   * @memberOf TableColumn
   */
  flexGrow?: number;

  /**
   * Min width of the column
   *
   * @memberOf TableColumn
   */
  minWidth?: number;

  /**
   * Max width of the column
   *
   * @memberOf TableColumn
   */
  maxWidth?: number;

  /**
   * The default width of the column, in pixels
   *
   * @memberOf TableColumn
   */
  width?: number;

  /**
   * The default width fixed not updated
   *
   * @memberOf TableColumn
   */
  widthFixed?: boolean;

  /**
   * Can the column be resized
   *
   * @memberOf TableColumn
   */
  resizeable?: boolean;

  /**
   * Custom sort comparator
   *
   * @memberOf TableColumn
   */
  comparator?: any;

  /**
   * Custom pipe transforms
   *
   * @memberOf TableColumn
   */
  pipe?: PipeTransform;

  /**
   * Can the column be sorted
   *
   * @memberOf TableColumn
   */
  sortable?: boolean;

  /**
   * Can the column be re-arranged by dragging
   *
   * @memberOf TableColumn
   */
  draggable?: boolean;

  /**
   * Whether the column can automatically resize to fill space in the table.
   *
   * @memberOf TableColumn
   */
  canAutoResize?: boolean;

  /**
   * Column name
   *
   * @memberOf TableColumn
   */
  name?: string;

  /**
   * Column label
   *
   * @memberOf TableColumn
   */
  label?: string;

  /**
   * Column group label
   *
   * @memberOf TableColumn
   */
  columnGroup?: string;

  /**
   * Property to bind to the row. Example:
   *
   * `someField` or `some.field.nested`, 0 (numeric)
   *
   * If left blank, will use the name as camel case conversion
   *
   * @memberOf TableColumn
   */
  prop?: TableColumnProp;

  /**
   * Cell template ref
   *
   * @memberOf TableColumn
   */
  cellTemplate?: any;

  /**
   * Header template ref
   *
   * @memberOf TableColumn
   */
  headerTemplate?: any;

  /**
   * Tree toggle template ref
   *
   * @memberOf TableColumn
   */
  treeToggleTemplate?: any;

  /**
   * CSS Classes for the cell
   *
   *
   * @memberOf TableColumn
   */
  cellClass?: string | ((data: any) => string | any);

  /**
   * CSS classes for the header
   *
   *
   * @memberOf TableColumn
   */
  headerClass?: string | ((data: any) => string | any);

  /**
   * Header checkbox enabled
   *
   * @memberOf TableColumn
   */
  headerCheckboxable?: boolean;

  /**
   * Is tree displayed on this column
   *
   * @memberOf TableColumn
   */
  isTreeColumn?: boolean;

  /**
   * Width of the tree level indent
   *
   * @memberOf TableColumn
   */
  treeLevelIndent?: number;

  /**
   * Summary function
   *
   * @memberOf TableColumn
   */
  summaryFunc?: (cells: any[]) => any;

  /**
   * Summary cell template ref
   *
   * @memberOf TableColumn
   */
  summaryTemplate?: any;

  /**
   * Data type of the column
   * See DataTypeEnum to check available types
   *
   * @memberOf TableColumn
   */
  dataType?: string;

  /**
   * Data type of the column
   * Custom dataType dependency for number of leading zeros
   *
   * @memberOf TableColumn
   */
  padStart?: number;

  /**
   * Data custom mask of the column
   * Imask dependnecy is required
   *
   * @memberOf TableColumn
   */
  dataCustomMask?: FactoryOpts | string;

  /**
   * Is column hidden or visible
   *
   * @memberOf TableColumn
   */
  visibleColumn: boolean;

  /**
   * Enable or disabel column hidden
   *
   * @memberOf TableColumn
   */
  hideColumn?: boolean;

  /**
   * Defines a visible default field
   *
   * @memberOf TableColumn
   */
  isDefaultVisible?: boolean;

  translate?: boolean;
  situation?: boolean;

  /**
   * Enable summary export report and summmary column at the datatables
   *
   * @memberOf TableColumn
   */
  summaryCurrency?: boolean;

  /**
   * Uses summaryValue in the summary if provided; otherwise, calculates it.
   *
   * @memberOf TableColumn
   */
  summaryValue?: string;

  /**
   * Uses currency in export file.
   *
   * @memberOf TableColumn
   */
  currency?: string | number | Signal<string | number>;
}
