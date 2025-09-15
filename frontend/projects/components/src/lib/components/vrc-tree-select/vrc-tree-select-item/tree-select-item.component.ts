import { Component, Input } from '@angular/core';
import { SelectableItem } from '../models/selectable-item';
import { TreeSelectService } from '../services/tree-select.service';

@Component({
  selector: 'tree-select-item',
  templateUrl: './tree-select-item.component.html',
  styleUrls: ['./tree-select-item.component.scss'],
})
export class TreeSelectItemComponent {
  @Input() onTouchedCallBack!: () => void;

  @Input() item!: SelectableItem;

  get isOpen(): boolean {
    return this.item.isOpen;
  }

  get allowParentSelection(): boolean {
    return this._selectService.options.allowParentSelection;
  }

  get minLevelToSelect(): number {
    return this._selectService.options.minLevelToSelect;
  }

  get hasLevel(): boolean {
    return !!(
      this.minLevelToSelect && this.item.level >= this.minLevelToSelect
    );
  }

  get needCheckBox(): boolean {
    return this._selectService.options.allowMultiple;
  }

  get filter(): string {
    return this._selectService.options.filter;
  }

  get isPartialSelect(): boolean {
    return (
      !this.item.haveAllChildrenSelected() &&
      !this.item.haveAllChildrenUnselected()
    );
  }

  constructor(private readonly _selectService: TreeSelectService) {}

  select(event: Event & { target: { className: string } }): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.item.hasChild || event.target.className === 'checkbox__label') {
      this._selectService.toggleItemSelection(this.item);
      this.onTouchedCallBack();
    }
    if (this.item.hasChild) {
      if (event.target.className === 'checkbox__label' && !this.item.isOpen) {
        this.toggleOpen(event);
      }
      if (event.target.className !== 'checkbox__label') {
        this.toggleOpen(event);
      }
    }
  }

  toggleOpen(event: Event & { target: { className: string } }): void {
    event.stopPropagation();
    this.item.isOpen = !this.item.isOpen;
  }
}
