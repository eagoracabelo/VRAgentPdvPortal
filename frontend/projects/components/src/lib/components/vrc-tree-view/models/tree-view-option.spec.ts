import { ITreeView } from '../interfaces/tree-view.interface';
import { TreeViewExpandMode } from './tree-view-expand-mode';
import { TreeViewOption } from './tree-view-option';

describe('TreeViewSelectOption', () => {
  let selectOption!: TreeViewOption;

  beforeEach(() => {
    selectOption = new TreeViewOption();
  });

  it('should be truthy', () => {
    expect(selectOption).toBeTruthy();
  });

  it('should return default filter expanded mode', () => {
    expect(selectOption.filterExpandMode).toEqual(TreeViewExpandMode.None);
  });

  it('should return "All" filter expanded mode', () => {
    selectOption.filter = 'item';
    expect(selectOption.filterExpandMode).toEqual(TreeViewExpandMode.All);
  });

  it('should that is not valid if items array is empty', () => {
    expect(selectOption.isValid()).toEqual(false);
  });

  it('should that is valid if items array is NOT empty', () => {
    const treeSelect: ITreeView = {
      value: 1,
      label: 'item',
      children: [],
    };
    selectOption.items = [treeSelect];
    expect(selectOption.isValid()).toEqual(true);
  });
});
