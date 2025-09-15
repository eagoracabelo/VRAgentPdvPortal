import { ITreeSelect } from '../interfaces/tree-select.interface';
import { ExpandMode } from './expand-mode';
import { TreeSelectOption } from './tree-select-option';

describe('SelectOption', () => {
  let selectOption!: TreeSelectOption;

  beforeEach(() => {
    selectOption = new TreeSelectOption();
  });

  it('should be truthy', () => {
    expect(selectOption).toBeTruthy();
  });

  it('should return default filter expanded mode', () => {
    expect(selectOption.filterExpandMode).toEqual(ExpandMode.None);
  });

  it('should return "All" filter expanded mode', () => {
    selectOption.filter = 'item';
    expect(selectOption.filterExpandMode).toEqual(ExpandMode.All);
  });

  it('should that is not valid if items array is empty', () => {
    expect(selectOption.isValid()).toEqual(false);
  });

  it('should that is valid if items array is NOT empty', () => {
    const treeSelect: ITreeSelect = {
      value: 1,
      label: 'item',
      children: [],
    };
    selectOption.items = [treeSelect];
    expect(selectOption.isValid()).toEqual(true);
  });
});
