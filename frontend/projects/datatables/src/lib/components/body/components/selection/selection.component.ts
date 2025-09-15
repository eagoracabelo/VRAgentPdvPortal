/* eslint-disable */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SelectionType } from '../../../../types/selection.type';
import { Keys } from '../../../../utils/keys';
import { selectRows, selectRowsBetween } from '../../../../utils/selection';

export interface Model {
  type: string;
  event: MouseEvent | KeyboardEvent;
  row: any;
  rowElement: any;
  cellElement: any;
  cellIndex: number;
}

@Component({
  selector: 'datatable-selection',
  templateUrl: './selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableSelectionComponent {
  @Input() selected!: any[];
  @Input() selectEnabled!: boolean;
  @Input() selectionType!: SelectionType;
  @Input() rowIdentity: any;
  @Input() selectCheck: any;

  @Input() rowClickActiveSelected!: boolean;
  selectedRowClicked!: any;

  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

  prevIndex!: number;

  _rows!: any[];

  @Input() set rows(val: any[]) {
    this._rows = val;
    this.selectedRowClicked = undefined;
  }

  get rows(): any[] {
    return this._rows;
  }

  selectRow(event: KeyboardEvent | MouseEvent, index: number, row: any): void {
    if (!this.selectEnabled) return;

    const chkbox = this.selectionType === SelectionType.checkbox;
    const multi = this.selectionType === SelectionType.multi;
    const multiClick = this.selectionType === SelectionType.multiClick;
    let selected: any[] = [];

    if (multi || chkbox || multiClick) {
      if (event.shiftKey) {
        selected = selectRowsBetween(
          [],
          this.rows,
          index,
          this.prevIndex,
          this.getRowSelectedIdx.bind(this),
        );
      } else if (event.ctrlKey || event.metaKey || multiClick || chkbox) {
        selected = selectRows(
          [...this.selected],
          row,
          this.getRowSelectedIdx.bind(this),
        );
      } else {
        selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
      }
    } else {
      selected = selectRows([], row, this.getRowSelectedIdx.bind(this));
    }

    if (typeof this.selectCheck === 'function') {
      selected = selected.filter(this.selectCheck.bind(this));
    }

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);

    this.prevIndex = index;

    this.select.emit({
      selected,
    });
  }

  selectRows(multipleRow: any[]) {
    const selected = [...this.selected];
    const indexesToSplice: number[] = [];
    for (let i = 0; i < selected.length; i++) {
      for (const row of multipleRow) {
        const rowId = JSON.stringify(this.rowIdentity(row));
        const selectedId = JSON.stringify(this.rowIdentity(selected[i]));

        if (rowId === selectedId) {
          indexesToSplice.push(i);
          break;
        }
      }
    }
    let countIndex = 0;
    if (indexesToSplice.length > 1) {
      for (const index of indexesToSplice) {
        selected.splice(index - countIndex, 1);
        countIndex++;
      }
    } else {
      selected.push(...multipleRow);
    }

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    this.select.emit({
      selected,
    });
  }

  onActivate(model: Model, index: number): void {
    const { type, event, row } = model;
    const chkbox = this.selectionType === SelectionType.checkbox;
    const select =
      (!chkbox && (type === 'click' || type === 'dblclick')) ||
      (chkbox && type === 'checkbox');
    const rowId = JSON.stringify(this.rowIdentity(row));
    const rows = this._rows.filter(
      (r) => JSON.stringify(this.rowIdentity(r)) === rowId,
    );

    if (select && rows.length > 1) {
      this.selectRows(rows);
    } else if (select) {
      this.selectRow(event, index, row);
    } else if (type === 'keydown') {
      if ((<KeyboardEvent>event).keyCode === Keys.return) {
        this.selectRow(event, index, rows);
      } else {
        this.onKeyboardFocus(model);
      }
    }

    this.setSelectedRowClicked(type, row);

    this.activate.emit(model);
  }

  setSelectedRowClicked(type: string, row: any): void {
    if (this.rowClickActiveSelected && type === 'click') {
      this.selectedRowClicked = row;
    }
  }

  onKeyboardFocus(model: Model): void {
    const { keyCode } = <KeyboardEvent>model.event;
    const shouldFocus =
      keyCode === Keys.up ||
      keyCode === Keys.down ||
      keyCode === Keys.right ||
      keyCode === Keys.left;

    if (shouldFocus) {
      const isCellSelection = this.selectionType === SelectionType.cell;

      if (!model.cellElement || !isCellSelection) {
        this.focusRow(model.rowElement, keyCode);
      } else if (isCellSelection) {
        this.focusCell(
          model.cellElement,
          model.rowElement,
          keyCode,
          model.cellIndex,
        );
      }
    }
  }

  focusRow(rowElement: any, keyCode: number): void {
    const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
    if (nextRowElement) nextRowElement.focus();
  }

  getPrevNextRow(rowElement: any, keyCode: number): any {
    const parentElement = rowElement.parentElement;

    if (parentElement) {
      let focusElement!: HTMLElement;
      if (keyCode === Keys.up) {
        focusElement = parentElement.previousElementSibling;
      } else if (keyCode === Keys.down) {
        focusElement = parentElement.nextElementSibling;
      }

      if (focusElement?.children?.length) {
        return focusElement.children[0];
      }
    }
  }

  focusCell(
    cellElement: any,
    rowElement: any,
    keyCode: number,
    cellIndex: number,
  ): void {
    let nextCellElement!: HTMLElement;

    if (keyCode === Keys.left) {
      nextCellElement = cellElement.previousElementSibling;
    } else if (keyCode === Keys.right) {
      nextCellElement = cellElement.nextElementSibling;
    } else if (keyCode === Keys.up || keyCode === Keys.down) {
      const nextRowElement = this.getPrevNextRow(rowElement, keyCode);
      if (nextRowElement) {
        const children = nextRowElement.getElementsByClassName(
          'datatable-body-cell',
        );
        if (children.length) nextCellElement = children[cellIndex];
      }
    }

    if (nextCellElement) nextCellElement.focus();
  }

  getRowSelected(row: any): boolean {
    return this.getRowSelectedIdx(row, this.selected) > -1;
  }

  getRowSelectedIdx(row: any, selected: any[]): number {
    if (!selected?.length) return -1;

    const rowId = this.rowIdentity(row);
    return selected.findIndex((r) => {
      const id = this.rowIdentity(r);
      return JSON.stringify(id) === JSON.stringify(rowId);
    });
  }
}
