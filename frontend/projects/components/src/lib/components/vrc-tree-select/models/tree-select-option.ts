import { ITreeSelect } from '../interfaces/tree-select.interface';
import { ExpandMode } from './expand-mode';

export interface ITreeSelectOption {
  allowMultiple?: boolean;
  closeOnSelection?: boolean;
  items?: ITreeSelect[];
  model?: ITreeSelect[];
  isOpen?: boolean;
  filter?: string;
  filterCaseSensitive?: boolean;
  allowParentSelection?: boolean;
  maxVisibleItemCount?: number;
  expandMode?: ExpandMode;
  resetAllSelected?: boolean;
  resetAllSelectedLabel?: string;
  minLevelToSelect?: number;
}

export class TreeSelectOption {
  allowMultiple = false;
  closeOnSelection = true;
  items: ITreeSelect[] = [];
  model!: ITreeSelect[];
  isOpen = false;
  filter = '';
  filterCaseSensitive = false;
  allowParentSelection = false;
  maxVisibleItemCount = 0;
  expandMode = ExpandMode.None;
  resetAllSelected = false;
  resetAllSelectedLabel = 'Limpar Seleção';
  minLevelToSelect = 0;

  get filterExpandMode(): ExpandMode {
    if (this.filter !== '') {
      return ExpandMode.All;
    } else {
      return this.expandMode;
    }
  }

  isValid(): boolean {
    return this.items && Array.isArray(this.items) && this.items.length > 0;
  }
}
