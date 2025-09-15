import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewCheckboxMode } from '../models/tree-view-checkbox-model';
import { TreeViewExpandMode } from '../models/tree-view-expand-mode';
import { ITreeViewOption, TreeViewOption } from '../models/tree-view-option';
import { TreeViewSelectableItem } from '../models/tree-view-selectable-item';

@Injectable()
export class TreeViewService {
  modelChanged$: Subject<ITreeView | ITreeView[]> = new Subject<
    ITreeView | ITreeView[]
  >();

  private _options: TreeViewOption = new TreeViewOption();
  private _items: TreeViewSelectableItem[] = [];

  get options(): TreeViewOption {
    return this._options;
  }

  setItems(value: ITreeView[]): void {
    this.setOptions({ items: value });
    this.setConfiguration(true);
    this.setExpandForList();
  }

  getInternalItems(): TreeViewSelectableItem[] {
    return this._items;
  }

  setSelection(values: ITreeView | ITreeView[]): void {
    this.setOptions({ model: values });

    if (!values) {
      this.setAllUnselected(this._items);
    }

    this.setConfiguration(false);
    this.modelChanged$.next(this._options.model);
    this.setExpandForList();
  }

  getInternalSelection(): TreeViewSelectableItem[] {
    return this.getSelectedItems();
  }

  toggleItemSelection(item: TreeViewSelectableItem): void {
    if (!this._options.allowMultiple) {
      this.setAllUnselected(this._items);
    }

    this.updateItemSelecionMode(item);

    const internalSelection = this.getInternalSelection().map((a) => a.data);
    this.setOptions({ model: internalSelection });

    if (this._options.closeOnSelection) {
      this.setOptions({ isOpen: false });
    }

    this.setConfiguration(false);

    this.modelChanged$.next(this._options.model);
  }

  setOptions(selectOption: ITreeViewOption): void {
    Object.assign(this._options, selectOption);
  }

  close(): void {
    if (this._options.isOpen) {
      this.setOptions({ isOpen: false });
      this.setConfiguration(false);
    }
  }

  setConfiguration(processItems: boolean): void {
    if (this._options.isValid()) {
      this.reconfigure(processItems);
    }
  }

  toggleOpen(): void {
    this.setOptions({ isOpen: !this._options.isOpen });
    this.setConfiguration(false);
  }

  setExpandForList(items: TreeViewSelectableItem[] = this._items): void {
    for (const item of items) {
      this.updateItemIsOpen(item);
    }
  }

  open(): void {
    if (!this._options.isOpen) {
      this.setOptions({ isOpen: true });
      this.setConfiguration(false);
    }
  }

  private updateItemIsOpen(item: TreeViewSelectableItem): void {
    if (this._options.filterExpandMode === TreeViewExpandMode.All) {
      item.isOpen = true;
      this.setExpandForList(item.children);
    }

    if (this._options.filterExpandMode === TreeViewExpandMode.Selection) {
      item.isOpen = item.children.some(
        (i: TreeViewSelectableItem) =>
          i.isOpen || i.selectionMode === TreeViewCheckboxMode.Check,
      );
      this.setExpandForList(item.children);
    }
  }

  private updateItemSelecionMode(item: TreeViewSelectableItem): void {
    if (item.selectionMode === TreeViewCheckboxMode.None) {
      item.setSelected(item, TreeViewCheckboxMode.Check);
    } else {
      item.setSelected(item, TreeViewCheckboxMode.None);
    }
  }

  private getModel(): ITreeView[] {
    if (!this._options.model) {
      return [];
    }

    return this.checkIfModelIsArray();
  }

  private checkIfModelIsArray(): ITreeView[] {
    if (!Array.isArray(this._options.model)) {
      return [this._options.model];
    } else {
      return this._options.model;
    }
  }

  private setAllUnselected(items: TreeViewSelectableItem[]): void {
    for (const item of items) {
      item.setSelected(item, TreeViewCheckboxMode.None);
    }
  }

  private toSelectableItems(
    treeSelectItems: ITreeView[],
  ): TreeViewSelectableItem[] {
    return treeSelectItems.map((item) => {
      const selectableItem = new TreeViewSelectableItem(
        item.value,
        item.label,
        item,
      );

      if ('children' in item) {
        selectableItem.children = this.toSelectableItems(item.children);
      }
      return selectableItem;
    });
  }

  private getSelectedItems(): TreeViewSelectableItem[] {
    let res: TreeViewSelectableItem[] = [];
    if (this._options.isValid()) {
      const finded = this.findSelectedItems(this._items);

      if (finded.length > 0) {
        res = finded;
      }
    }
    return res;
  }

  private findSelectedItems(
    items: TreeViewSelectableItem[],
  ): TreeViewSelectableItem[] {
    let findedSelected: TreeViewSelectableItem[] = [];
    for (const item of items) {
      if (item.hasChild) {
        this.setFindedItemSelectionMode(item);
        findedSelected = [
          ...findedSelected,
          ...this.findSelectedItems(item.children),
        ];
      } else if (item.selectionMode === TreeViewCheckboxMode.Check) {
        findedSelected = [...findedSelected, item];
      }
    }
    return findedSelected;
  }

  private setFindedItemSelectionMode(item: TreeViewSelectableItem): void {
    if (
      item.haveSomeChildrenUnselected() &&
      !item.haveAllChildrenUnselected()
    ) {
      item.selectionMode = TreeViewCheckboxMode.Minus;
    }
    if (item.haveAllChildrenSelected()) {
      item.selectionMode = TreeViewCheckboxMode.Check;
    }
    if (item.haveAllChildrenUnselected()) {
      item.selectionMode = TreeViewCheckboxMode.None;
    }
  }

  private reconfigure(processItems: boolean): void {
    this.toggleCloseOnSelection();

    if (processItems) {
      this._items = this.toSelectableItems(this._options.items);
    }

    const model = this.getModel();
    let select: TreeViewSelectableItem[] = [];

    for (const m of model) {
      select = [...select, ...this.getItemForModel(m, this._items)];
    }

    for (const s of select) {
      s.selectionMode = TreeViewCheckboxMode.Check;
    }

    this.findSelectedItems(this._items);
  }

  private getItemForModel(
    selected: ITreeView,
    selectableItems: TreeViewSelectableItem[],
  ): TreeViewSelectableItem[] {
    let result: TreeViewSelectableItem[] = [];
    for (const item of selectableItems) {
      if (item.id === selected.value) {
        result.push(item);
      }
      if (item.children && item.children.length > 0) {
        result = [...result, ...this.getItemForModel(selected, item.children)];
      }
    }
    return result;
  }

  private toggleCloseOnSelection(): void {
    if (this._options.allowMultiple && this._options.closeOnSelection) {
      this._options.closeOnSelection = false;
    } else if (
      !this._options.allowMultiple &&
      !this._options.closeOnSelection
    ) {
      this._options.closeOnSelection = true;
    }
  }
}
