import { ExpandMode } from './expand-mode';

export class TreeSelectDefaultOptions {
  allowFilter: boolean = true;
  filterPlaceholder: string = 'Buscar';
  placeholder: string = '';
  maxVisibleItemCount: number = 1;
  allowParentSelection: boolean = true;
  filterCaseSensitive: boolean = false;
  expandMode = ExpandMode.None;
  allowMultiple: boolean = false;
  isRequired: boolean = false;
  isDisabled: boolean = false;
  resetAllSelected: boolean = false;
  resetAllSelectedLabel: string = 'Limpar Seleção';
  minLevelToSelect = 0;
}
