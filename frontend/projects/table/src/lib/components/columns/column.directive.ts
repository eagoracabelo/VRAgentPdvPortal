import {
  ContentChild,
  Directive,
  Input,
  OnChanges,
  TemplateRef,
} from '@angular/core';
import { FactoryOpts } from 'imask';

import { ColumnChangesService } from '../../services/column-changes.service';
import { TableColumnProp } from '../../types/table-column.type';
import { TableColumnCellDirective } from './column-cell.directive';
import { TableColumnHeaderDirective } from './column-header.directive';

/* eslint-disable */
@Directive({ selector: 'vrc-table-column' })
export class TableColumnDirective implements OnChanges {
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
  @Input() canAutoResize!: boolean;
  @Input() minWidth!: number;
  @Input() width!: number;
  @Input() widthFixed = false;
  @Input() maxWidth!: number;
  @Input() checkboxable!: boolean;
  @Input() headerCheckboxable!: boolean;
  @Input() headerClass!: string | ((data: any) => string | any);
  @Input() cellClass!: string | ((data: any) => string | any);
  @Input() treeLevelIndent!: number;
  @Input() summaryFunc!: (cells: any[]) => any;
  @Input() summaryTemplate!: TemplateRef<any>;

  @Input() hideColumn!: boolean;

  @Input() exportable!: boolean;

  @Input() dataType!: string;
  @Input() padStart!: number;

  @Input() dataCustomMask!: FactoryOpts | string;

  @Input('cellTemplate')
  _cellTemplateInput!: TemplateRef<any>;

  @ContentChild(TableColumnCellDirective, {
    read: TemplateRef,
    static: true,
  })
  _cellTemplateQuery!: TemplateRef<any>;

  get cellTemplate(): TemplateRef<any> {
    return this._cellTemplateInput || this._cellTemplateQuery;
  }

  @Input('headerTemplate')
  _headerTemplateInput!: TemplateRef<any>;

  @ContentChild(TableColumnHeaderDirective, {
    read: TemplateRef,
    static: true,
  })
  _headerTemplateQuery!: TemplateRef<any>;

  get headerTemplate(): TemplateRef<any> {
    return this._headerTemplateInput || this._headerTemplateQuery;
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
