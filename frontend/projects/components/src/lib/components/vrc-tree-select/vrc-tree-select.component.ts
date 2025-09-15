import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Output,
  Provider,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getControl } from '../../shared/utils/utils';
import { VrSelectField } from '../../shared/vr-element-field/vr-select-field';
import { ITreeSelect } from './interfaces/tree-select.interface';
import { SelectableItem } from './models/selectable-item';
import { TreeSelectDefaultOptions } from './models/tree-select-default-options';
import { TreeSelectService } from './services/tree-select.service';

const noop = (): void => {
  /* empty */
};

export const CUSTOM_TREE_SELECT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcTreeSelectComponent),
  multi: true,
};

@Component({
  selector: 'vrc-tree-select',
  templateUrl: './vrc-tree-select.component.html',
  styleUrls: ['./vrc-tree-select.component.scss'],
  providers: [CUSTOM_TREE_SELECT_CONTROL_VALUE_ACCESSOR, TreeSelectService],
  encapsulation: ViewEncapsulation.None,
})
export class VrcTreeSelectComponent
  extends VrSelectField
  implements OnInit, AfterViewInit
{
  @HostBinding('class') classError = 'error-message';

  @Output() update = new EventEmitter<ITreeSelect[]>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onUpdateChildrenAndParents = new EventEmitter<ITreeSelect[]>();

  @Input() placeholder!: string;
  @Input() filterPlaceholder!: string;
  @Input() allowFilter!: boolean;
  @Input() defaultOpts: TreeSelectDefaultOptions =
    new TreeSelectDefaultOptions();

  get title(): string {
    const items = this._selectService.getInternalItems();
    const selected = this.findSelected(items, []);

    if (!this.isDisabled) return '';

    return selected.map((item: { text: string }) => item.text).join('\n');
  }

  get visibleSelection(): SelectableItem[] {
    const items = this._selectService.getInternalItems();
    const selected = this.findSelected(items, []);
    return selected.slice(0, this.maxVisibleItemCount);
  }

  private findSelected(
    items: SelectableItem[],
    prev: SelectableItem[],
  ): SelectableItem[] {
    items?.forEach((item: SelectableItem) => {
      if (item.children?.length > 0) {
        prev = this.findSelected(item.children, prev);
      } else if (item.isSelected) {
        prev.push(item);
      }
    });
    return prev;
  }

  @Input()
  override set value(value: ITreeSelect | ITreeSelect[]) {
    this.writeValue(value);
  }

  @Input()
  set items(value: ITreeSelect[]) {
    this._selectService.setItems(value);
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
  set expandMode(value: string) {
    this._selectService.setOptions({ expandMode: value });
    this._selectService.setConfiguration(true);
    this._selectService.setExpandForList();
  }

  get expandMode(): string {
    return this._selectService.options.expandMode;
  }

  @Input()
  set multiple(value: boolean) {
    if (!value) {
      this.allowParentSelection = false;
    }

    this._selectService.setOptions({ allowMultiple: value });
    this._selectService.setConfiguration(true);
  }

  @Input()
  set resetAllSelected(value: boolean) {
    this._selectService.setOptions({ resetAllSelected: value });
    this._selectService.setConfiguration(true);
  }

  get resetAllSelected(): boolean {
    return this._selectService.options.resetAllSelected;
  }

  @Input()
  set resetAllSelectedLabel(value: string) {
    this._selectService.setOptions({ resetAllSelectedLabel: value });
    this._selectService.setConfiguration(true);
  }

  get resetAllSelectedLabel(): string {
    return this._selectService.options.resetAllSelectedLabel;
  }

  get multiple(): boolean {
    return this._selectService.options.allowMultiple;
  }

  @Input()
  set maxVisibleItemCount(value: number) {
    this._selectService.setOptions({ maxVisibleItemCount: value });
    this._selectService.setConfiguration(true);
  }

  get maxVisibleItemCount(): number {
    return this._selectService.options.maxVisibleItemCount;
  }

  get internalItems(): SelectableItem[] {
    return this._selectService.getInternalItems();
  }

  get selection(): ITreeSelect[] {
    const itemsAmount = this._selectService.options.model?.length ?? 0;
    const hasExceededItems = itemsAmount - this.maxVisibleItemCount > 0;

    this.showMoreLink = this.maxVisibleItemCount > 0 && hasExceededItems;
    this.exceedAmount = itemsAmount - this.maxVisibleItemCount;

    return this._selectService.options.model ?? [];
  }

  get filter(): string {
    return this._selectService.options.filter;
  }

  set filter(value: string) {
    this._selectService.setOptions({ filter: value });
    this._selectService.setConfiguration(true);
    for (const item of this.internalItems) {
      this.processMatchFilterTreeItem(item, this._selectService.options.filter);
    }
    this._selectService.setExpandForList();
  }

  get isOpen(): boolean {
    return this._selectService.options.isOpen;
  }

  @Input() set minLevelToSelect(value: number) {
    this._selectService.options.minLevelToSelect = value;
  }

  showMoreLink = false;
  exceedAmount = 0;
  onTouchedCallback: () => void = noop;

  private onChangeCallback: (_: unknown) => void = noop;
  private _haveFocus = false;
  private _inputFocus = false;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private readonly _controlContainer: ControlContainer,
    private readonly _cd: ChangeDetectorRef,
    private readonly _selectService: TreeSelectService,
  ) {
    super();

    this.clickedOutside = this.clickedOutside.bind(this);

    this._selectService.modelChanged$.subscribe((result) => {
      this.onChangeCallback(result);
      this.onTouched();
      this.onChange(result);
    });

    this._selectService.selectedChildrenAndParents$.subscribe((result) => {
      this.onUpdateChildrenAndParents.emit(result);
    });

    this.maxVisibleItemCount = this.defaultOpts.maxVisibleItemCount;
    this.allowParentSelection = this.defaultOpts.allowParentSelection;
    this.allowFilter = this.defaultOpts.allowFilter;
    this.filterCaseSensitive = this.defaultOpts.filterCaseSensitive;
    this.filterPlaceholder = this.defaultOpts.filterPlaceholder;
    this.placeholder = this.defaultOpts.placeholder;
    this.expandMode = this.defaultOpts.expandMode;
    this.multiple = this.defaultOpts.allowMultiple;
    this.isDisabled = this.defaultOpts.isDisabled;
    this.isRequired = this.defaultOpts.isRequired;
    this.resetAllSelected = this.defaultOpts.resetAllSelected;
    this.resetAllSelectedLabel = this.defaultOpts.resetAllSelectedLabel;
    this.minLevelToSelect = this.defaultOpts.minLevelToSelect;
  }

  override ngOnInit(): void {
    this.initControl();
    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    this._cd.markForCheck();
  }

  toggle(event: Event): void {
    event.preventDefault();
    this._haveFocus = true;
    this._selectService.toggleOpen();
  }

  removeItem(event: Event, item: SelectableItem): void {
    event.stopPropagation();
    this._selectService.toggleItemSelection(item);
  }

  clickedOutside(): void {
    if (!this._inputFocus) {
      if (
        (!this._haveFocus && this.isOpen) ||
        (this._haveFocus && !this.isOpen)
      ) {
        this.onClickOutsideTouch();
      }
      this._haveFocus = false;
    }
  }

  onClickOutsideTouch(): void {
    this._selectService.close();
    this.onTouchedCallback();
  }

  setInputFocus(): void {
    this._inputFocus = true;
  }

  setInputFocusOut(): void {
    this._inputFocus = false;
  }

  override writeValue(value: ITreeSelect | ITreeSelect[]): void {
    if (value) {
      this._selectService.setSelection(value);
    }
  }

  reset(_: Event): void {
    this._selectService.reset();
  }

  private initControl(): void {
    this.control = getControl(this._controlContainer, this.formControlName);
  }

  private processMatchFilterTreeItem(
    selectableItem: SelectableItem,
    filter: string,
  ): boolean {
    let result = false;
    if (selectableItem?.children && selectableItem.children.length > 0) {
      selectableItem.children.forEach((child) => {
        result = this.processMatchFilterTreeItem(child, filter) || result;
      });
    }

    selectableItem.matchFilter = this.getFilterResult(
      selectableItem,
      filter,
      result,
    );
    return selectableItem.matchFilter;
  }

  private getFilterResult(
    selectableItem: SelectableItem,
    filter: string,
    result: boolean,
  ): boolean {
    return this.filterCaseSensitive
      ? selectableItem.text.indexOf(filter) > -1 || result
      : selectableItem.text.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
          result;
  }
}
