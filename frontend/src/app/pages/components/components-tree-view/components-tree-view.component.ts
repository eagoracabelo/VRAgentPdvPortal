import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {
  TreeViewDefaultOptions,
  TreeViewExpandMode,
  TreeViewSelectableItem,
} from '@vrsoftbr/vr-components';
import { MarkdownCommon } from '../../../shared/models/markdown.common';
import { Data } from './data';

@Component({
  selector: 'vr-components-tree-view',
  templateUrl: './components-tree-view.component.html',
  styleUrls: ['./components-tree-view.component.scss'],
})
export class ComponentsTreeViewComponent extends MarkdownCommon {
  items = Data;
  selectedMappedItems: { value: number; label: string }[] = [];
  selectedRawItems: TreeViewSelectableItem[] = [];
  filterItems = [
    {
      value: 10,
      label: 'Loja 01',
    },
    {
      value: 20,
      label: 'Loja 02',
    },
    {
      value: 30,
      label: 'Loja 03',
    },
  ];

  config1: TreeViewDefaultOptions = {
    allowFilter: false,
    allowMultiple: false,
    allowParentSelection: false,
    defaultFilterOption: 'Todos',
    expandMode: TreeViewExpandMode.None,
    filterCaseSensitive: false,
    filterPlaceholder: 'Buscar Lojas e Usuários',
    isDisabled: false,
    isRequired: false,
  };

  config2: TreeViewDefaultOptions = {
    allowFilter: false,
    allowMultiple: false,
    allowParentSelection: false,
    defaultFilterOption: 'Todos',
    expandMode: TreeViewExpandMode.None,
    filterCaseSensitive: false,
    filterPlaceholder: 'Buscar Lojas e Usuários',
    isDisabled: false,
    isRequired: false,
  };

  formGroup!: FormGroup;

  constructor(private _fb: FormBuilder) {
    super();

    this.formGroup = this._fb.group({
      treeviewForm: new FormControl(null),
    });
  }

  update(items: TreeViewSelectableItem[]): void {
    this.selectedMappedItems = items.map((i) => {
      return { value: i.id, label: i.text };
    });

    this.selectedRawItems = items;
  }

  toggleAllowFilter1(): void {
    this.config1.allowFilter = !this.config1.allowFilter;
  }

  toggleDisabled1(): void {
    this.config1.isDisabled = !this.config1.isDisabled;
  }

  onExpandMode1(value: string): void {
    this.config1.expandMode = value;
  }

  toggleAllowParent1(): void {
    this.config1.allowParentSelection = !this.config1.allowParentSelection;
  }

  toggleMultiple1(): void {
    this.config1.allowMultiple = !this.config1.allowMultiple;

    if (!this.config1.allowMultiple) {
      this.config1.allowParentSelection = false;
    }
  }

  toggleFilterCaseSensitive1(): void {
    this.config1.filterCaseSensitive = !this.config1.filterCaseSensitive;
  }

  toggleAllowFilter2(): void {
    this.config2.allowFilter = !this.config2.allowFilter;
  }

  toggleDisabled2(): void {
    this.config2.isDisabled = !this.config2.isDisabled;
  }

  onExpandMode2(value: string): void {
    this.config2.expandMode = value;
  }

  toggleAllowParent2(): void {
    this.config2.allowParentSelection = !this.config2.allowParentSelection;
  }

  toggleMultiple2(): void {
    this.config2.allowMultiple = !this.config2.allowMultiple;

    if (!this.config2.allowMultiple) {
      this.config2.allowParentSelection = false;
    }
  }

  toggleFilterCaseSensitive2(): void {
    this.config2.filterCaseSensitive = !this.config2.filterCaseSensitive;
  }
}
