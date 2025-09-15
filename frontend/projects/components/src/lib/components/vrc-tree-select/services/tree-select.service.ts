import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ITreeSelect } from '../interfaces/tree-select.interface';
import { ExpandMode } from '../models/expand-mode';
import { SelectableItem } from '../models/selectable-item';
import {
  ITreeSelectOption,
  TreeSelectOption,
} from '../models/tree-select-option';

@Injectable()
export class TreeSelectService {
  modelChanged$: Subject<ITreeSelect[]> = new Subject<ITreeSelect[]>();
  selectedChildrenAndParents$: Subject<ITreeSelect[]> = new Subject<
    ITreeSelect[]
  >();
  @Output() updateTreeSelectForm = new EventEmitter<ITreeSelect[]>();
  private _items: SelectableItem[] = [];
  private _options: TreeSelectOption = new TreeSelectOption();

  get options(): TreeSelectOption {
    return this._options;
  }

  close(): void {
    if (this._options.isOpen) {
      this.setOptions({ isOpen: false });
      this.setConfiguration(false);
    }
  }

  open(): void {
    if (!this._options.isOpen) {
      this.setOptions({ isOpen: true });
      this.setConfiguration(false);
    }
  }

  toggleOpen(): void {
    this.setOptions({ isOpen: !this._options.isOpen });
    this.setConfiguration(false);
  }

  setItems(value: ITreeSelect[]): void {
    this.setOptions({ items: value });
    this.setConfiguration(true);
    this.setExpandForList();
  }

  reset(): void {
    this.setAllUnselected(this._items);
    const internalSelection = this.getInternalSelection().map((a) => a.data);
    this.setOptions({ model: internalSelection });
    this.setConfiguration(false);
    this.modelChanged$.next(this._options.model);
  }

  getInternalItems(): SelectableItem[] {
    return this._items;
  }

  setSelection(values: ITreeSelect | ITreeSelect[] | number[]): void {
    if (values instanceof Array) {
      if ((values as number[]).every((value) => !isNaN(value))) {
        values = this.getOptionsById(values as number[]);
      }
      this.setOptions({ model: values as ITreeSelect[] });
    } else {
      this.setOptions({ model: [values] });
    }

    if (!values) {
      this.setAllUnselected(this._items);
    }

    this.setConfiguration(false);
    this.modelChanged$.next(this._options.model);
    this.setExpandForList();
  }

  getInternalSelection(): SelectableItem[] {
    const selectedItems = this.getSelectedItems();
    if (selectedItems && selectedItems.length > 0) {
      let i = 0;
      const max = this._options.maxVisibleItemCount;

      for (const item of selectedItems) {
        item.isVisible = i < max || max === 0;

        if (item.isVisible && max > 0) {
          i++;
        }
      }
    }
    return selectedItems;
  }

  toggleItemSelection(item: SelectableItem): void {
    if (!this._options.allowMultiple) {
      this.setAllUnselected(this._items);
    }
    item.setSelected(item, !item.isSelected, this._options.minLevelToSelect);

    if (this._options.minLevelToSelect) {
      this.setOptions({ model: [item.data] });
    } else {
      const internalSelection = this.getInternalSelection().map((a) => a.data);
      this.setOptions({ model: internalSelection });
    }

    if (this._options.closeOnSelection) {
      this.setOptions({ isOpen: false });
    }

    this.setConfiguration(false);
    this.modelChanged$.next(this._options.model);
    this.outPutSelectedChildrenAndParents();
  }

  private outPutSelectedChildrenAndParents(): void {
    const mapChildren = (item: SelectableItem): ITreeSelect[] => {
      return item.children
        .filter((child) => child.isSelected)
        .map((child) => {
          return {
            value: child.data.value,
            label: child.data.label,
            children: child.hasChild ? mapChildren(child) : [],
          };
        });
    };
    const outPut = this._items
      .map((item) => {
        const children = mapChildren(item);

        return {
          value: item.data.value,
          label: item.data.label,
          children,
        };
      })
      .filter((item) => item.children.length > 0);
    this.selectedChildrenAndParents$.next(outPut);
  }

  setOptions(selectOption: ITreeSelectOption): void {
    Object.assign(this._options, selectOption);
  }

  setConfiguration(processItems: boolean): void {
    if (this._options.isValid()) {
      this.reconfigure(processItems);
    }
  }

  setExpandForList(): void {
    for (const item of this._items) {
      item.isOpen = this._options.filterExpandMode === ExpandMode.All;
      if (this._options.filterExpandMode === ExpandMode.Selection) {
        item.isOpen = item.children.some(
          (i: SelectableItem) => i.isOpen || i.isSelected,
        );
      }
    }
  }

  private getModel(): ITreeSelect[] {
    if (!this._options.model) {
      return [];
    } else if (!Array.isArray(this._options.model)) {
      return [this._options.model];
    } else {
      return this._options.model;
    }
  }

  private setAllUnselected(items: SelectableItem[]): void {
    for (const item of items) {
      item.setSelected(item, false, this._options.minLevelToSelect);
    }
  }

  private toSelectableItems(treeSelectItems: ITreeSelect[]): SelectableItem[] {
    return treeSelectItems.map((item) => {
      const selectableItem = new SelectableItem(
        item.value,
        item.label,
        item,
        item.level ?? 0,
      );

      if ('children' in item) {
        selectableItem.children = this.toSelectableItems(item.children);
      }
      return selectableItem;
    });
  }

  private getSelectedItems(): SelectableItem[] {
    let res: SelectableItem[] = [];
    if (this._options.isValid()) {
      const finded = this.findSelectedItems(this._items);

      if (finded.length > 0) {
        res = finded;
      }
    }
    return res;
  }

  private findSelectedItems(items: SelectableItem[]): SelectableItem[] {
    let findedSelected: SelectableItem[] = [];
    items.forEach((item) => {
      if (item.hasChild && item.isSelected) {
        if (item.haveSomeChildrenUnselected()) {
          item.isSelected = false;
        }
        if (item.haveAllChildrenUnselected()) {
          item.isSelected = false;
        } else {
          findedSelected = [
            ...findedSelected,
            ...this.findSelectedItems(item.children),
          ];
        }
      } else if (item.hasChild) {
        if (item.haveAllChildrenSelected()) {
          item.isSelected = true;
        }
        findedSelected = [
          ...findedSelected,
          ...this.findSelectedItems(item.children),
        ];
      } else if (item.isSelected) {
        findedSelected = [...findedSelected, item];
      }
    });
    return findedSelected;
  }

  private reconfigure(processItems: boolean): void {
    this.toggleCloseOnSelection();

    if (processItems) {
      this._items = this.toSelectableItems(this._options.items);
    }

    const model = this.getModel();
    let select: SelectableItem[] = [];
    model.forEach((v) => {
      select = [...select, ...this.getItemForModel(v, this._items)];
    });
    select.forEach((v) => (v.isSelected = true));
  }

  private getItemForModel(
    selected: ITreeSelect,
    selectableItems: SelectableItem[],
  ): SelectableItem[] {
    let result: SelectableItem[] = [];
    for (const item of selectableItems) {
      if (selected) {
        if (item.id === selected.value && item.text === selected.label) {
          if (item.children && item.children.length > 0) {
            const canPush = item.children.every((itemChild) => {
              return itemChild.isSelected;
            });
            if (canPush) {
              result.push(item);
            }
          } else {
            result.push(item);
          }
        }
        if (item.children && item.children.length > 0) {
          result = [
            ...result,
            ...this.getItemForModel(selected, item.children),
          ];
        }
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

  getOptionsById(values: number[]): ITreeSelect[] {
    const selectedValues: ITreeSelect[] = [];
    const getSelectedValues = (items: ITreeSelect[]): void => {
      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const foundValue = values.find((value) => {
            return item.value === value;
          });

          if (foundValue) {
            selectedValues.push(item);
          }
          getSelectedValues(item.children);
        }
      }
    };

    if (
      Array.isArray(this._options?.items) &&
      this._options?.items.length > 0
    ) {
      for (const item of this._options.items) {
        getSelectedValues(item.children);
      }
      if (selectedValues.length > 0) {
        return selectedValues;
      }
    }

    return [];
  }
}
