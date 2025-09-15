import { ITreeSelect } from '../interfaces/tree-select.interface';

export class SelectableItem {
  isSelected = false;
  children: SelectableItem[] = [];
  isOpen = false;
  matchFilter = true;
  isVisible = false;

  constructor(
    private _id: number,
    private _text: string,
    private _data: ITreeSelect,
    private _level: number,
  ) {}

  get id(): number {
    return this._id;
  }

  get text(): string {
    return this._text;
  }

  get data(): ITreeSelect {
    return this._data;
  }

  get level(): number {
    return this._level;
  }

  get hasChild(): boolean {
    return this.children.length > 0;
  }

  setSelected(
    item: SelectableItem,
    isSelected: boolean,
    minLevelToSelect: number,
  ): void {
    item.isSelected = isSelected;
    if (!minLevelToSelect || !isSelected) {
      item.children.forEach((child) => {
        child.isSelected = isSelected;
        this.setSelected(child, isSelected, minLevelToSelect);
      });
    }
  }

  haveAllChildrenUnselected(): boolean {
    return this.children.every((child) => child.isSelected === false);
  }

  haveSomeChildrenUnselected(): boolean {
    return this.children.some((child) => child.isSelected === false);
  }

  haveAllChildrenSelected(): boolean {
    return this.children.every((child) => child.isSelected);
  }
}
