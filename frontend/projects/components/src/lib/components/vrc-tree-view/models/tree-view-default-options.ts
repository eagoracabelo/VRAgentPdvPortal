import { TreeViewExpandMode } from './tree-view-expand-mode';

export class TreeViewDefaultOptions {
  allowFilter: boolean = false;
  filterPlaceholder: string = '';
  allowParentSelection: boolean = false;
  filterCaseSensitive: boolean = false;
  expandMode = TreeViewExpandMode.None;
  allowMultiple: boolean = false;
  isRequired: boolean = false;
  isDisabled: boolean = false;
  defaultFilterOption: string = '';
}
