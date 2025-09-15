import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewExpandMode } from './tree-view-expand-mode';

export interface ITreeViewOption {
  allowMultiple?: boolean;
  closeOnSelection?: boolean;
  items?: ITreeView[];
  model?: ITreeView[] | ITreeView;
  isOpen?: boolean;
  filter?: string;
  filterCaseSensitive?: boolean;
  allowParentSelection?: boolean;
  expandMode?: TreeViewExpandMode;
}

export class TreeViewOption {
  allowMultiple = false;
  closeOnSelection = true;
  items: ITreeView[] = [];
  model!: ITreeView[] | ITreeView;
  isOpen = false;
  filter = '';
  filterCaseSensitive = false;
  allowParentSelection = false;
  expandMode = TreeViewExpandMode.None;

  get filterExpandMode(): TreeViewExpandMode {
    if (this.filter !== '') {
      return TreeViewExpandMode.All;
    } else {
      return this.expandMode;
    }
  }

  isValid(): boolean {
    return this.items && Array.isArray(this.items) && this.items.length > 0;
  }
}
