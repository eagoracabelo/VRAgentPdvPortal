import { Component, Input, TemplateRef } from '@angular/core';

import { TreeViewSelectableItem } from '../models/tree-view-selectable-item';
import { TreeViewService } from '../services/tree-view.service';

@Component({
  selector: 'tree-view-item',
  templateUrl: './tree-view-item.component.html',
  styleUrls: ['./tree-view-item.component.scss'],
})
export class TreeViewItemComponent {
  @Input() onTouchedCallBack!: () => void;

  @Input() item!: TreeViewSelectableItem;

  @Input() templates:
    | TemplateRef<unknown>
    | { [key: string]: TemplateRef<unknown> }
    | null = null;

  get isOpen(): boolean {
    return this.item.isOpen;
  }

  get allowParentSelection(): boolean {
    return this._selectService.options.allowParentSelection;
  }

  get needCheckBox(): boolean {
    return this._selectService.options.allowMultiple;
  }

  get filter(): string {
    return this._selectService.options.filter;
  }

  constructor(private readonly _selectService: TreeViewService) {}

  select(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this._selectService.toggleItemSelection(this.item);
    this.onTouchedCallBack();
  }

  toggleOpen(event: Event): void {
    event.stopPropagation();
    this.item.isOpen = !this.item.isOpen;
  }
}
