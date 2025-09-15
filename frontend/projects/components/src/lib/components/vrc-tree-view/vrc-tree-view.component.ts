import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  Provider,
  SkipSelf,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';

import { getControl } from '../../shared/utils/utils';
import { VrElementField } from '../../shared/vr-element-field/vr-element-field';
import { ITreeViewFilterItem } from './interfaces/tree-view-filter-item.interface';
import { ITreeView } from './interfaces/tree-view.interface';
import { TreeViewDefaultOptions } from './models/tree-view-default-options';
import { TreeViewSelectableItem } from './models/tree-view-selectable-item';
import { TreeViewService } from './services/tree-view.service';

const noop = (): void => {
  /* empty */
};

export const CUSTOM_TREE_VIEW_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcTreeViewComponent),
  multi: true,
};

@Component({
  selector: 'vrc-tree-view',
  templateUrl: './vrc-tree-view.component.html',
  styleUrls: ['./vrc-tree-view.component.scss'],
  providers: [CUSTOM_TREE_VIEW_CONTROL_VALUE_ACCESSOR, TreeViewService],
  encapsulation: ViewEncapsulation.None,
})
export class VrcTreeViewComponent
  extends VrElementField
  implements OnInit, AfterViewInit
{
  @Output() update = new EventEmitter<TreeViewSelectableItem[]>();

  @Input() defaultFilterOption!: string;
  @Input() filterPlaceholder!: string;
  @Input() allowFilter!: boolean;
  @Input() defaultOpts: TreeViewDefaultOptions = new TreeViewDefaultOptions();

  @Input()
  set items(value: ITreeView[]) {
    this._selectService.setItems(value);
  }

  @Input()
  set filterItems(value: ITreeViewFilterItem[]) {
    this._filterItems = value;
  }

  get filterItems(): ITreeViewFilterItem[] {
    return this._filterItems;
  }

  @Input()
  override set value(value: ITreeView | ITreeView[]) {
    this.writeValue(value);
  }

  @Input()
  set allowParentSelection(value: boolean) {
    if (value) {
      this.multiple = true;
    }

    this._selectService.setOptions({ allowParentSelection: value });
    this._selectService.setConfiguration(true);
  }

  get allowParentSelection(): boolean {
    return this._selectService.options.allowParentSelection;
  }

  @Input()
  set multiple(value: boolean) {
    if (!value) {
      this.allowParentSelection = false;
    }

    this._selectService.setOptions({ allowMultiple: value });
    this._selectService.setConfiguration(true);
  }

  get multiple(): boolean {
    return this._selectService.options.allowMultiple;
  }

  @Input()
  set filterCaseSensitive(value: boolean) {
    this._selectService.setOptions({ filterCaseSensitive: value });
    this._selectService.setConfiguration(true);
  }

  get filterCaseSensitive(): boolean {
    return this._selectService.options.filterCaseSensitive;
  }

  @Input()
  set expandMode(value: string) {
    this._selectService.setOptions({ expandMode: value });
    this._selectService.setConfiguration(true);
    this._selectService.setExpandForList();
  }

  @Input() templates:
    | TemplateRef<unknown>
    | { [key: string]: TemplateRef<unknown> }
    | null = null;

  get expandMode(): string {
    return this._selectService.options.expandMode;
  }

  get internalItems(): TreeViewSelectableItem[] {
    return this._selectService.getInternalItems();
  }

  get selection(): TreeViewSelectableItem[] {
    return this._selectService.getInternalSelection();
  }

  get filter(): string {
    return this._selectService.options.filter;
  }

  get selectedFilter(): string {
    return this._selectedFilter;
  }

  set selectedFilter(value: string) {
    this._selectedFilter = value;
    this.filter = this._selectService.options.filter;
  }

  set filter(value: string) {
    this._selectService.setOptions({ filter: value });
    this._selectService.setConfiguration(true);
    this.searchAndFilter();
    this._selectService.setExpandForList();
  }

  onTouchedCallback: () => void = noop;

  private onChangeCallback: (_: unknown) => void = noop;

  private _selectedFilter = '-1';
  private _filterItems: ITreeViewFilterItem[] = [];

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private readonly _controlContainer: ControlContainer,
    private readonly _cd: ChangeDetectorRef,
    private _selectService: TreeViewService,
  ) {
    super();

    this._selectService.modelChanged$.subscribe((result) => {
      this.onChangeCallback(result);
      this.onTouched();
      this.onChange(result);
      this.update.emit(this._selectService.getInternalSelection());
    });

    this.allowParentSelection = this.defaultOpts.allowParentSelection;
    this.allowFilter = this.defaultOpts.allowFilter;
    this.filterCaseSensitive = this.defaultOpts.filterCaseSensitive;
    this.filterPlaceholder = this.defaultOpts.filterPlaceholder;
    this.expandMode = this.defaultOpts.expandMode;
    this.multiple = this.defaultOpts.allowMultiple;
    this.defaultFilterOption = this.defaultOpts.defaultFilterOption;
  }

  override ngOnInit(): void {
    this.initControl();
  }

  override ngAfterViewInit(): void {
    this._cd.markForCheck();
  }

  removeItem(event: Event, item: TreeViewSelectableItem): void {
    event.stopPropagation();
    this._selectService.toggleItemSelection(item);
    this.update.emit(this._selectService.getInternalSelection());
  }

  override writeValue(value: ITreeView | ITreeView[]): void {
    this._selectService.setSelection(value);
  }

  private initControl(): void {
    this.control = getControl(this._controlContainer, this.formControlName);
  }

  private searchAndFilter(): void {
    for (const item of this.internalItems) {
      this.searchItemsToFilter(item);
    }
  }

  private searchItemsToFilter(item: TreeViewSelectableItem): void {
    if (item.id === Number(this.selectedFilter)) {
      this.processMatchFilterTreeItem(item, this._selectService.options.filter);
    } else {
      item.matchFilter = false;
    }

    if (Number(this.selectedFilter) === -1) {
      this.processMatchFilterTreeItem(item, this._selectService.options.filter);
    }
  }

  private processMatchFilterTreeItem(
    selectableItem: TreeViewSelectableItem,
    filter: string,
  ): boolean {
    let result = false;
    if (selectableItem?.children && selectableItem.children.length > 0) {
      for (const child of selectableItem.children) {
        result = this.processMatchFilterTreeItem(child, filter) || result;
      }
    }

    selectableItem.matchFilter = this.filterCaseSensitive
      ? selectableItem.text.indexOf(filter) > -1 || result
      : selectableItem.text.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
        result;

    return selectableItem.matchFilter;
  }
}
