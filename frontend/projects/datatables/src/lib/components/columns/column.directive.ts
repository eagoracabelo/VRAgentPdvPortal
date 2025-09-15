import {
  ContentChild,
  Directive,
  input,
  Input,
  OnChanges,
  TemplateRef,
} from '@angular/core';
import { FactoryOpts } from 'imask';

import { ColumnChangesService } from '../../services/column-changes.service';
import { TableColumnProp } from '../../types/table-column.type';
import { DataTableColumnCellDirective } from './column-cell.directive';
import { DataTableColumnHeaderDirective } from './column-header.directive';
import { DataTableColumnCellTreeToggle } from './tree.directive';

/* eslint-disable */
@Directive({ selector: 'vrc-datatable-column' })
export class DataTableColumnDirective implements OnChanges {
  @Input() name!: string;
  @Input() label?: string;
  @Input() prop!: TableColumnProp;
  @Input() frozenLeft: any;
  @Input() frozenRight: any;
  @Input() flexGrow!: number;
  @Input() resizeable!: boolean;
  @Input() comparator: any;
  @Input() pipe: any;
  @Input() sortable!: boolean;
  @Input() draggable!: boolean;
  @Input() isDefaultVisible = true;
  @Input() canAutoResize!: boolean;
  @Input() summaryCurrency: boolean = false;
  @Input() summaryValue?: string;
  @Input() minWidth!: number;
  @Input() width!: number;
  @Input() widthFixed = false;
  @Input() maxWidth!: number;
  @Input() checkboxable = false;
  @Input() headerCheckboxable!: boolean;
  @Input() headerClass!: string | ((data: any) => string | any);
  @Input() cellClass!: string | ((data: any) => string | any);
  @Input() isTreeColumn!: boolean;
  @Input() treeLevelIndent!: number;
  @Input() summaryFunc!: (cells: any[]) => any;
  @Input() summaryTemplate!: TemplateRef<any>;
  @Input() columnGroup: string = '';
  @Input() translate: boolean = false;
  @Input() situation: boolean = false;
  currency = input<string | number | undefined>(undefined);

  @Input() hideColumn!: boolean;

  @Input() dataType!: string;
  @Input() padStart!: number;

  @Input() dataCustomMask!: FactoryOpts | string;

  @Input('cellTemplate')
  _cellTemplateInput!: TemplateRef<any>;

  @ContentChild(DataTableColumnCellDirective, {
    read: TemplateRef,
    static: true,
  })
  _cellTemplateQuery!: TemplateRef<any>;

  get cellTemplate(): TemplateRef<any> {
    return this._cellTemplateInput || this._cellTemplateQuery;
  }

  @Input('headerTemplate')
  _headerTemplateInput!: TemplateRef<any>;

  @ContentChild(DataTableColumnHeaderDirective, {
    read: TemplateRef,
    static: true,
  })
  _headerTemplateQuery!: TemplateRef<any>;

  get headerTemplate(): TemplateRef<any> {
    return this._headerTemplateInput || this._headerTemplateQuery;
  }

  @Input('treeToggleTemplate')
  _treeToggleTemplateInput!: TemplateRef<any>;

  @ContentChild(DataTableColumnCellTreeToggle, {
    read: TemplateRef,
    static: true,
  })
  _treeToggleTemplateQuery!: TemplateRef<any>;

  get treeToggleTemplate(): TemplateRef<any> {
    return this._treeToggleTemplateInput || this._treeToggleTemplateQuery;
  }

  private isFirstChange = true;

  constructor(private readonly columnChangesService: ColumnChangesService) {}

  ngOnChanges(): void {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.columnChangesService.onInputChange();
    }
  }
}
