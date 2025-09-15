import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewCheckboxMode } from './tree-view-checkbox-model';

export class TreeViewSelectableItem {
  selectionMode: TreeViewCheckboxMode = TreeViewCheckboxMode.None;
  children: TreeViewSelectableItem[] = [];
  isOpen = false;
  matchFilter = true;

  constructor(
    private _id: number,
    private _text: string,
    private _data: ITreeView,
  ) {}

  get id(): number {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get data(): ITreeView {
    return this._data;
  }

  get hasChild(): boolean {
    return this.children.length > 0;
  }

  setSelected(
    item: TreeViewSelectableItem,
    selectionMode: TreeViewCheckboxMode,
  ): void {
    item.selectionMode = selectionMode;
    for (const child of item.children) {
      child.selectionMode = selectionMode;
      this.setSelected(child, selectionMode);
    }
  }

  haveAllChildrenUnselected(child = this.children): boolean {
    return child.every((c) => {
      if (c.selectionMode === TreeViewCheckboxMode.None) {
        return true;
      } else if (c.children && c.children.length > 0) {
        return this.haveAllChildrenUnselected(c.children);
      } else {
        return false;
      }
    });
  }

  haveSomeChildrenUnselected(child = this.children): boolean {
    return child.some((c) => {
      if (c.selectionMode === TreeViewCheckboxMode.None) {
        return true;
      } else if (c.children && c.children.length > 0) {
        return this.haveSomeChildrenUnselected(c.children);
      } else {
        return false;
      }
    });
  }

  haveAllChildrenSelected(child = this.children): boolean {
    return child.every((c) => {
      if (c.selectionMode === TreeViewCheckboxMode.Check) {
        return true;
      } else if (c.children && c.children.length > 0) {
        return this.haveAllChildrenSelected(c.children);
      } else {
        return false;
      }
    });
  }
}
