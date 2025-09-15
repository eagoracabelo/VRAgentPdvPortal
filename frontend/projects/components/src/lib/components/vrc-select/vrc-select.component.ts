import {
  CdkConnectedOverlay,
  ConnectedOverlayPositionChange,
  ConnectedPosition,
  VerticalConnectionPos,
  ViewportRuler,
} from '@angular/cdk/overlay';

import {
  AfterViewChecked,
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import { isNil } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { ETokens } from '../../shared';
import { TranslatorPipeImpl } from '../../shared/classes/translator-pipe';
import { getControl, getRandomId } from '../../shared/utils/utils';
import { VrSelectField } from '../../shared/vr-element-field/vr-select-field';
import {
  Select2Data,
  Select2Group,
  Select2Option,
  Select2SearchEvent,
  Select2UpdateEvent,
  Select2UpdateValue,
  Select2Utils,
  Select2Value,
  timeout,
} from './models/vrc-select-utils';

const displaySearchStatusList = ['default', 'hidden', 'always'];

type TOptionsSelect2Value = Select2Value | null | undefined;
type TOptionsSelect2UpdateValue = Select2UpdateValue | null | undefined;

@Component({
  selector: 'vrc-select',
  templateUrl: './vrc-select.component.html',
  styleUrls: ['./vrc-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcSelectComponent
  extends VrSelectField
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked, DoCheck
{
  private _data!: Select2Data;
  private _dataTemp!: Select2Data;

  /** data of options & optiongrps */

  @Input() enableExternalSearch = false;
  @Output() externalSearchEvent$ = new EventEmitter<void>();

  @Input() minCharForSearch = 0;
  @Input() displaySearchStatus!: 'default' | 'hidden' | 'always';
  @Input() placeholder!: string;
  @Input() customSearchEnabled!: boolean;
  @Input() multiple!: boolean;
  @Input() limitSelection = 0;
  @Input() listPosition: 'above' | 'below' | 'auto' | null | undefined =
    'below';
  @Input() isCheckbox!: boolean;
  @Input() hasMainSelector!: boolean;
  @Input() maxVisibleItem: number = 0;
  @Input() placeHolderSearch = 'Buscar';
  @Input() translate = true;
  @Input() override hideLabel = false;
  @Input() overlay = false;

  /** use the material style */
  @Input() noStyle!: '' | 'true' | true;

  /** use it for change the pattern of the filter search */
  @Input() editPattern!: (str: string) => string;

  /** template for formating */
  @Input() templates!:
    | TemplateRef<unknown>
    | { [key: string]: TemplateRef<unknown> };

  /** the max height of the results container when opening the select */
  @Input() resultMaxHeight = '12.5rem';

  @Input() resetAllSelected = false;
  @Input() resetAllSelectedLabel = 'Limpar Seleção';
  @Input() selectedOptionTemplate:
    | TemplateRef<unknown>
    | { [key: string]: TemplateRef<unknown> }
    | null = null;

  @Input() mask!: Record<string, unknown>;
  @Input() unmasked: 'typed' | boolean = true;

  @Output() update = new EventEmitter<Select2UpdateEvent<Select2UpdateValue>>();
  @Output() open = new EventEmitter<VrcSelectComponent>();
  @Output() close = new EventEmitter<VrcSelectComponent>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() focus = new EventEmitter<VrcSelectComponent>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() blur = new EventEmitter<VrcSelectComponent>();
  @Output() search = new EventEmitter<Select2SearchEvent<Select2UpdateValue>>();

  option: Select2Option | Select2Option[] | null = null;
  isOpen = false;
  searchStyle!: string;

  /** Whether the element is focused or not. */
  focused = false;

  filteredData!: Select2Data;

  exceedAmount: number = 0;
  showExceeded: boolean = false;

  @Input() set data(value: Select2Data) {
    this._dataTemp = value;
    this._data = value;
    this.translateData();
    this.initSelectOptions();
    this.exceededItemsCount();
  }

  get title(): string {
    if (!this.isDisabled || !this.multiple || !this.select2Options) {
      return '';
    }

    return this.select2Options.map((item) => item.label).join('\n');
  }

  get data(): Select2Data {
    return this._data;
  }

  get getHoveringValue(): TOptionsSelect2Value {
    return this.hoveringValue;
  }

  get select2Options(): Select2Option[] | null {
    return this.multiple ? (this.option as Select2Option[]) : null;
  }
  get select2Option(): Select2Option | null {
    return this.multiple ? null : (this.option as Select2Option);
  }
  get searchText(): string {
    return this.innerSearchText;
  }

  set setHoveringValue(hoveringValue: TOptionsSelect2Value) {
    this.hoveringValue = hoveringValue;
  }

  set searchText(text: string) {
    if (this.customSearchEnabled) {
      this.search.emit({
        component: this,
        value: this._value,
        search: text,
      });
    }
    this.innerSearchText = text;
  }

  /** minimal data of show the search field */
  @Input()
  get minCountForSearch(): number | string | undefined {
    return this._minCountForSearch;
  }
  set minCountForSearch(value: number | string | undefined) {
    this._minCountForSearch = value;
    this.updateSearchBox();
  }

  /** Whether the element is required. */
  override get isRequired(): boolean {
    return this._required;
  }
  @Input()
  override set isRequired(value: boolean) {
    this._required = this._coerceBooleanProperty(value);
  }

  /** Whether selected items should be hidden. */
  override get isDisabled(): boolean {
    return this._control ? !!this._control?.disabled : this._disabled;
  }
  @Input()
  override set isDisabled(value: boolean) {
    this._disabled = this._coerceBooleanProperty(value);
  }

  /** Whether items are hidden when has. */
  @Input()
  get hideSelectedItems(): boolean {
    return this._hideSelectedItems;
  }
  set hideSelectedItems(value: boolean) {
    this._hideSelectedItems = this._coerceBooleanProperty(value);
  }

  /** Whether the element is readonly. */
  @Input()
  override set isReadOnly(value: boolean) {
    this._readonly = this._coerceBooleanProperty(value);
  }

  override get isReadOnly(): boolean {
    return this._readonly;
  }

  /** The input element's value. */
  @Input()
  override get value(): Select2UpdateValue | Select2UpdateValue[] {
    return this._value;
  }
  override set value(value: Select2UpdateValue | Select2UpdateValue[]) {
    if (this.testValueChange(this._value, value)) {
      setTimeout(() => {
        this._value = value as Select2UpdateValue;
        this.writeValue(value as TOptionsSelect2UpdateValue);
      }, 10);
    }
  }

  /** Tab index for the select2 element. */
  @Input()
  get tabIndex(): number {
    return this.isDisabled ? -1 : this._tabIndex;
  }
  set tabIndex(value: number) {
    if (typeof value !== 'undefined') {
      this._tabIndex = value;
    }
  }

  @HostBinding('attr.aria-invalid')
  get ariaInvalid(): boolean {
    return this._isErrorState();
  }

  @HostBinding('class.nostyle')
  get classNostyle(): boolean {
    return (
      this.noStyle === '' || this.noStyle === true || this.noStyle === 'true'
    );
  }

  @HostBinding('class.select2-above')
  get select2above(): boolean {
    return !this.overlay
      ? this.listPosition === 'above'
      : this._isAbobeOverlay();
  }

  overlayWidth!: number;
  overlayHeight!: number;
  _triggerRect!: DOMRect;
  _dropdownRect!: DOMRect | undefined;

  get _positions(): ConnectedPosition[] | null | undefined {
    return this.listPosition === 'auto' ? undefined : null;
  }

  private _minCountForSearch?: number | string;

  @ViewChild(CdkConnectedOverlay)
  private readonly cdkConnectedOverlay!: CdkConnectedOverlay;
  @ViewChild('selection') private readonly selection!: ElementRef<HTMLElement>;
  @ViewChild('results')
  private readonly resultContainer!: ElementRef<HTMLElement>;
  @ViewChildren('result') private readonly results!: QueryList<
    ElementRef<HTMLElement>
  >;
  @ViewChild('searchInput')
  private readonly searchInput!: ElementRef<HTMLElement>;
  @ViewChild('dropdown') private readonly dropdown!: ElementRef<HTMLElement>;

  private hoveringValue: TOptionsSelect2Value = null;
  private innerSearchText = '';
  private isSearchboxHidden!: boolean;
  private selectionElement!: HTMLElement;
  private get resultsElement(): HTMLElement {
    return this.resultContainer?.nativeElement;
  }

  private readonly _stateChanges = new Subject<void>();

  /** Tab index for the element. */
  private _tabIndex: number;

  private _hideSelectedItems = false;
  private _clickDetection = false;
  private _clickDetectionFc: (e: MouseEvent) => void;

  private _value!: Select2UpdateValue;
  private _previousNativeValue!: Select2UpdateValue | Select2UpdateValue[];
  private _overlayPosition!: VerticalConnectionPos;

  private readonly _subs: Subscription[] = [];

  constructor(
    protected _viewportRuler: ViewportRuler,
    @Optional()
    @Host()
    @SkipSelf()
    private readonly _controlContainer: ControlContainer,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    @Optional() private readonly _parentForm: NgForm,
    @Optional() private readonly _parentFormGroup: FormGroupDirective,
    @Self() @Optional() private readonly _control: NgControl,
    @Attribute('tabindex') tabIndex: string,
    @Optional()
    @Inject(forwardRef(() => ETokens.TRANSLATOR_TOKEN))
    protected readonly _translatorPipe?: TranslatorPipeImpl,
  ) {
    super();
    this._tabIndex = parseInt(tabIndex, 10) || 0;

    if (this._control) {
      this._control.valueAccessor = this;
    }

    this._clickDetectionFc = this.clickDetection.bind(this);
  }

  /** Unique id of the element. */
  @Input()
  @HostBinding('id')
  override id = getRandomId();

  protected override setError(isError: boolean): void {
    super.setError(isError);
    this._changeDetectorRef?.detectChanges();
  }

  override ngOnInit(): void {
    this.initControl();
    this.setControl();
    this.initViewPortRuler();
    this.initSelectOptions();
    super.ngOnInit();
    this.watchTranslatorChanges();
  }

  ngAfterViewChecked(): void {
    this._changeDetectorRef.detectChanges();
    this.verifyHasValue();
  }

  private watchTranslatorChanges(): void {
    if (this.translate && this._translatorPipe?.translatorChange) {
      const sub = this._translatorPipe.translatorChange.subscribe((_) => {
        this.translateData();
      });
      this._subs.push(sub);
    }
  }

  private translateData(): void {
    if (
      this.translate &&
      this._translatorPipe &&
      this._translatorPipe.transform &&
      this._data &&
      Array.isArray(this._data)
    ) {
      this._data = [];
      for (const item of this._dataTemp) {
        this._data.push({
          ...item,
          label: this._translatorPipe.transform(item.label),
        });
      }

      this.translateSelecteds();
    }
  }

  private translateSelecteds(): void {
    if (this.option) {
      if (Array.isArray(this.option)) {
        for (const item of this.option) {
          item.label = this.translateLabel(item.value, item.label);
        }
      } else {
        this.option.label = this.translateLabel(
          this.option.value,
          this.option.label,
        );
      }
    }
  }

  private translateLabel(value: Select2Value, label: string): string {
    const getTag = this.findInDataTag(value);
    if (getTag && this._translatorPipe) {
      return this._translatorPipe.transform(getTag) ?? label;
    }

    return label;
  }

  private findInDataTag(value: Select2Value): string | undefined {
    const finded = this._dataTemp.find((item) => {
      if ('value' in item && item.value === value) {
        return item;
      }

      return undefined;
    });

    return finded?.label;
  }

  private initViewPortRuler(): void {
    const sub = this._viewportRuler.change(100).subscribe(() => {
      if (this.isOpen) {
        this.triggerRect();
      }
    });
    this._subs.push(sub);
  }

  private initSelectOptions(): void {
    const value = this._control
      ? (this._control.value as Select2UpdateValue)
      : this.value;
    const option = Select2Utils.getOptionsByValue(
      this.data,
      value as Select2UpdateValue,
      this.multiple,
    );
    if (option !== null) {
      this.option = option;
    }
    if (!Array.isArray(option)) {
      this.hoveringValue = this.value as string | undefined;
    }
    this.updateSearchBox();

    if (this.customSearchEnabled) {
      this.updateFilteredData();
    }
  }

  private initControl(): void {
    this.control = getControl(this._controlContainer, this.formControlName);

    if (this._control) {
      this._control.valueAccessor = this;
    }
  }

  override ngAfterViewInit(): void {
    const sub = this.cdkConnectedOverlay.positionChange.subscribe(
      (posChange: ConnectedOverlayPositionChange) => {
        if (
          this.listPosition === 'auto' &&
          posChange.connectionPair?.originY &&
          this._overlayPosition !== posChange.connectionPair.originY
        ) {
          this.triggerRect();
          this._overlayPosition = posChange.connectionPair.originY;
          this._changeDetectorRef.detectChanges();
        }
      },
    );

    this.selectionElement = this.selection.nativeElement;
    this.triggerRect();
    this._subs.push(sub);
  }

  protected override resetStatusError(): void {
    super.resetStatusError();
    this.updateSearchBox();
    this._dirtyCheckNativeValue();
  }

  ngDoCheck(): void {
    this.updateSearchBox();
    this._dirtyCheckNativeValue();
    if (this._triggerRect) {
      if (this.overlayWidth !== this._triggerRect.width) {
        this.overlayWidth = this._triggerRect.width;
      }
      if (
        this._dropdownRect &&
        this._dropdownRect?.height > 0 &&
        this.overlayHeight !== this._dropdownRect.height
      ) {
        this.overlayHeight =
          this.listPosition === 'auto' ? this._dropdownRect.height : 0;
      }
    }
  }

  updateSearchBox(): void {
    const hidden = this.customSearchEnabled
      ? false
      : Select2Utils.isSearchboxHiddex(this.data, this._minCountForSearch);
    if (this.isSearchboxHidden !== hidden) {
      this.isSearchboxHidden = hidden;
    }
  }

  hideSearch(): boolean {
    const displaySearchStatus =
      displaySearchStatusList.indexOf(this.displaySearchStatus) > -1
        ? this.displaySearchStatus
        : 'default';
    return (
      (displaySearchStatus === 'default' && this.isSearchboxHidden) ||
      displaySearchStatus === 'hidden'
    );
  }

  getOptionStyle(option: Select2Option): string {
    return (
      'select2-results__option ' +
      (option.value === this.hoveringValue
        ? 'select2-results__option--highlighted '
        : '') +
      (option.classes ?? '')
    );
  }

  getOptionStyleDoubleCheck(option: Select2Option): string {
    return (
      (option.value === this.hoveringValue
        ? 'select2-results__option--highlighted '
        : '') + (option.classes ?? '')
    );
  }

  mouseenter(option: Select2Option): void {
    if (!option.disabled) {
      this.hoveringValue = option.value;
    }
  }

  click(option: Select2Option): void {
    if (this.testSelection(option)) {
      this.select(option);
    }
  }

  prevChange(event: Event): void {
    event.stopPropagation();
  }

  toggleOpenAndClose(focus = true, open?: boolean): void {
    if (this.isDisabled) {
      return;
    }
    this._focus(focus);
    this.isOpen = open ?? !this.isOpen;

    if (this.isOpen) {
      this.innerSearchText = '';
      this.updateFilteredData();
      this._focusSearchboxOrResultsElement(focus);

      setTimeout(() => {
        if (this.option) {
          const option: Select2Option =
            this.option instanceof Array ? this.option[0] : this.option;
          this.updateScrollFromOption(option);
        } else if (this.resultsElement) {
          this.resultsElement.scrollTop = 0;
        }

        setTimeout(() => {
          this.triggerRect();
          this.cdkConnectedOverlay?.overlayRef?.updatePosition();
        }, 100);
      });
      this.open.emit(this);
    } else {
      this.close.emit(this);
      this.onTouched();
    }

    if (this.isOpen && !this._clickDetection && focus) {
      setTimeout(() => {
        window.document.body.addEventListener(
          'click',
          this._clickDetectionFc,
          false,
        );
        this._clickDetection = true;
      }, timeout);
    }

    this._changeDetectorRef.markForCheck();
  }

  hasTemplate(option: Select2Option | Select2Group, defaut: string): boolean {
    return (
      this.templates instanceof TemplateRef ||
      (this.templates &&
        option.templateId &&
        this.templates[option.templateId] instanceof TemplateRef) ||
      (this.templates && this.templates[defaut] instanceof TemplateRef)
    );
  }

  getTemplate(
    option: Select2Option | Select2Group,
    defaut: string,
  ):
    | TemplateRef<unknown>
    | {
        [key: string]: TemplateRef<unknown>;
      }
    | undefined {
    if (this.hasTemplate(option, defaut)) {
      const templates = this.templates;

      if (!!option && option.templateId) {
        const templateId: string = option.templateId;
        const temp = (templates as { [key: string]: TemplateRef<unknown> })[
          templateId
        ];

        if (temp) {
          return temp;
        }
      }

      if (defaut) {
        const temp =
          typeof templates !== 'object' || templates instanceof TemplateRef
            ? undefined
            : templates[defaut];

        if (temp) {
          return temp;
        }
      }

      return templates;
    }
    return undefined;
  }

  triggerRect(): void {
    this._triggerRect = this.selectionElement.getBoundingClientRect();
    this._dropdownRect = this.dropdown?.nativeElement
      ? this.dropdown.nativeElement.getBoundingClientRect()
      : undefined;
  }

  private testSelection(option: Select2Option): boolean {
    if (option.disabled) {
      return false;
    }

    if (
      !this.multiple ||
      !this.limitSelection ||
      (Array.isArray(this._value) && this._value.length < this.limitSelection)
    ) {
      return true;
    }
    return false;
  }

  private testValueChange(
    value1: Select2UpdateValue | Select2UpdateValue[],
    value2: Select2UpdateValue | Select2UpdateValue[],
  ): boolean {
    if (
      ((value1 === null || value1 === undefined) &&
        (value2 === null || value2 === undefined)) ||
      value1 === value2
    ) {
      return false;
    }

    if (
      this.multiple &&
      value1 &&
      (value1 as Select2Value[]).length &&
      value2 &&
      (value2 as Select2Value[]).length &&
      (value1 as Select2Value[]).length === (value2 as Select2Value[]).length
    ) {
      for (const e1 of value1 as Select2Value[]) {
        const test = (value2 as Select2Value[]).indexOf(e1) > -1;

        if (!test) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  private updateFilteredData(): void {
    setTimeout(() => {
      let result = this.data;
      if (this.multiple && this.hideSelectedItems) {
        result = Select2Utils.getFilteredSelectedData(result, this.option);
      }

      if (
        !this.customSearchEnabled &&
        this.searchText &&
        this.searchText.length >= +this.minCharForSearch
      ) {
        result = Select2Utils.getFilteredData(
          result,
          this.searchText,
          this.editPattern,
        );
      }

      if (Select2Utils.valueIsNotInFilteredData(result, this.hoveringValue)) {
        this.hoveringValue = Select2Utils.getFirstAvailableOption(result);
      }

      this.filteredData = result;
      this._changeDetectorRef.markForCheck();
    });
  }

  private clickDetection(e: MouseEvent): void {
    if (!this.ifParentContainsClass(e.target as HTMLElement, 'selection')) {
      if (
        this.isOpen &&
        !this.ifParentContainsClass(e.target as HTMLElement, 'select2-dropdown')
      ) {
        this.toggleOpenAndClose();
      }
      if (!this.ifParentContainsId(e.target as HTMLElement, this.id)) {
        this.clickExit();
      }
    } else if (
      this.isOpen &&
      !this.ifParentContainsId(e.target as HTMLElement, this.id)
    ) {
      this.toggleOpenAndClose();
      this.clickExit();
    }
  }

  private clickExit(): void {
    this._focus(false);
    window.document.body.removeEventListener('click', this._clickDetectionFc);
    this._clickDetection = false;
  }

  private ifParentContainsClass(
    element: HTMLElement,
    cssClass: string,
  ): boolean {
    return this.getParentElementByClass(element, cssClass) !== null;
  }

  private ifParentContainsId(element: HTMLElement, id: string): boolean {
    return this.getParentElementById(element, id) !== null;
  }

  private getParentElementByClass(
    element: HTMLElement,
    cssClass: string,
  ): HTMLElement | null {
    if (this.containClasses(element, cssClass.trim().split(/\s+/))) {
      return element;
    }
    return element.parentElement
      ? this.getParentElementByClass(element.parentElement, cssClass)
      : null;
  }

  private getParentElementById(
    element: HTMLElement,
    id: string,
  ): HTMLElement | null {
    if (element.id === id) {
      return element;
    }
    return element.parentElement
      ? this.getParentElementById(element.parentElement, id)
      : null;
  }

  private containClasses(element: HTMLElement, cssClasses: string[]): boolean {
    if (!element.classList) {
      return false;
    }
    for (const cssClass of cssClasses) {
      if (!element.classList.contains(cssClass)) {
        return false;
      }
    }
    return true;
  }

  focusin(): void {
    if (this.isDisabled) {
      return;
    }
    this._focus(true);
  }

  focusout(): void {
    if (
      this.selectionElement &&
      !this.selectionElement.classList.contains('select2-focused')
    ) {
      this._focus(false);
      this.onTouched();
    }
  }

  private moveUp(): void {
    this.updateScrollFromOption(
      Select2Utils.getPreviousOption(this.filteredData, this.hoveringValue),
    );
  }

  private moveDown(): void {
    this.updateScrollFromOption(
      Select2Utils.getNextOption(this.filteredData, this.hoveringValue),
    );
  }

  private updateScrollFromOption(option: Select2Option | null): void {
    if (option) {
      this.hoveringValue = option.value;
      const domElement = this.results.find(
        (r) => r.nativeElement.innerText.trim() === option.label,
      );
      if (domElement && this.resultsElement) {
        this.resultsElement.scrollTop = 0;
        const listClientRect = this.resultsElement.getBoundingClientRect();
        const optionClientRect =
          domElement.nativeElement.getBoundingClientRect();
        this.resultsElement.scrollTop =
          optionClientRect.top - listClientRect.top;
      }
    }
  }

  private selectByEnter(): void {
    if (!isNil(this.hoveringValue)) {
      const option = Select2Utils.getOptionByValue(
        this.data,
        this.hoveringValue,
      );
      this.select(option);
    }
  }

  select(option: Select2Option | null): void {
    let value: Select2UpdateValue | null = null;
    let options: Select2Option[] | null;
    if (option !== null) {
      if (this.multiple) {
        options = this.option as Select2Option[];
        const index = options?.findIndex(
          (op: Select2Option) => op.value === option.value,
        );
        this.setMain(index, options, option);
        value = (this.option as Select2Option[]).map((op) => op.value);
        this.exceededItemsCount();
      } else {
        this.option = option;
        if (this.isOpen) {
          this.isOpen = false;
          this.close.emit(this);
          if (this.selectionElement) {
            this.selectionElement.focus();
          }
        }
        value = this.option.value;
      }
    } else {
      this.option = null;
    }

    if (this.multiple && this.hideSelectedItems) {
      this.updateFilteredData();
    }

    if (value !== null) {
      if (this._control) {
        this.onChange(value);
      } else {
        this._value = value;
      }
    }

    if (Array.isArray(this.option)) {
      options = this.option;
    } else if (this.option) {
      options = [this.option];
    } else {
      options = null;
    }

    this.update.emit({
      component: this,
      value: value ?? ({} as Select2UpdateValue),
      options: options ?? [],
    });
  }

  private setMain(
    index: number,
    options: Array<Select2Option | Select2Option[]>,
    option: Select2Option | Select2Option[],
  ): void {
    if (index === -1) {
      options.push(option);
      if (Array.isArray(this._value) && this._value.length === 1) {
        if (!Array.isArray(options[0])) {
          options[0].main = true;
        }
      }
    } else {
      if (!Array.isArray(options[index])) {
        if (options[index]?.main === true) {
          delete options[index].main;
          options.splice(index, 1);
          if (options[0] && !Array.isArray(options[0])) {
            options[0].main = true;
          }
        } else {
          options.splice(index, 1);
        }
      }
    }
  }

  keyDown(e: KeyboardEvent): void {
    if (this._testKey(e, ['ArrowDown', 40])) {
      this.moveDown();
      e.preventDefault();
    } else if (this._testKey(e, ['ArrowUp', 38])) {
      this.moveUp();
      e.preventDefault();
    } else if (this._testKey(e, ['Enter', 13])) {
      this.selectByEnter();
      e.preventDefault();
    } else if (this._testKey(e, ['Escape', 'Tab', 9, 27]) && this.isOpen) {
      this.toggleOpenAndClose();
      this._focus(false);
    }
  }

  openKey(e: KeyboardEvent): void {
    if (this._testKey(e, ['ArrowDown', 'ArrowUp', 'Enter', 40, 38, 13])) {
      this.toggleOpenAndClose();
      e.preventDefault();
    } else if (this._testKey(e, ['Escape', 'Tab', 9, 27])) {
      this._focus(false);
      this.onTouched();
    }
  }

  searchUpdate(e: Event): void {
    this.searchText = (e.target as HTMLInputElement).value;
    this.updateFilteredData();
  }

  isSelected(option: Select2Option): string {
    return Select2Utils.isSelected(this.option, option, this.multiple);
  }

  setIsDisabled(option: Select2Option): boolean {
    return !!option.disabled;
  }

  removeSelection(e: MouseEvent, option: Select2Option): void {
    Select2Utils.removeSelection(this.option, option);

    if (this.multiple && this.hideSelectedItems) {
      this.updateFilteredData();
    }

    const value = (this.option as Select2Option[]).map((op) => op.value);

    if (this._control) {
      this.onChange(value);
    } else {
      this._value = value;
    }

    let options: Select2Option[] | null;
    if (Array.isArray(this.option)) {
      options = this.option;
    } else if (this.option) {
      options = [this.option];
    } else {
      options = null;
    }

    this.update.emit({
      component: this,
      value,
      options: options ?? [],
    });

    e.preventDefault();
    e.stopPropagation();
    if (this.isOpen) {
      this._focusSearchboxOrResultsElement();
    }

    this.exceededItemsCount();
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * \@param value
   */
  override writeValue(value: TOptionsSelect2UpdateValue): void {
    this._setSelectionByValue(value);
  }

  _isErrorState(): boolean {
    const isInvalid = this._control?.invalid;
    const isTouched = this._control?.touched;
    const isSubmitted =
      this._parentFormGroup?.submitted || this._parentForm?.submitted;

    return !!(isInvalid && (isTouched || isSubmitted));
  }

  private _testKey(
    event: KeyboardEvent,
    refs: (number | string)[] = [],
  ): boolean {
    return this._isKey(this._getKey(event), refs);
  }

  private _getKey(event: KeyboardEvent): number | string {
    let code: number | string = '';

    if (event.key !== undefined) {
      code = event.key;
    } else if (event['keyCode'] !== undefined) {
      code = event['keyCode'];
    } else if (event.code !== undefined) {
      code = event.code;
    } else {
      event.preventDefault();
    }

    return code;
  }

  private _isKey(
    code: number | string,
    refs: (number | string)[] = [],
  ): boolean {
    return refs && refs.length > 0 ? refs.indexOf(code) !== -1 : false;
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: TOptionsSelect2UpdateValue): void {
    if (this.option || (value !== undefined && value !== null)) {
      const isArray = Array.isArray(value);
      if (this.multiple && value && !isArray) {
        throw new Error('Non array value.');
      } else if (this.data) {
        if (this.multiple) {
          this.option = []; // if value is null, then empty option and return
          if (isArray) {
            // value is not null. Preselect value
            const selectedValues = Select2Utils.getOptionsByValue(
              this.data,
              value,
              this.multiple,
            );
            if (Array.isArray(selectedValues)) {
              selectedValues.forEach((item) => this.select(item));
            } else {
              this.select(selectedValues);
            }
          }
        } else {
          this.select(
            Select2Utils.getOptionByValue(this.data, value as Select2Value),
          );
        }
      } else if (this._control) {
        this._control.viewToModelUpdate(value);
      }

      this._changeDetectorRef.markForCheck();
    }
  }

  /** Does some manual dirty checking on the native input `value` property. */
  private _dirtyCheckNativeValue(): void {
    const newValue = this.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this._stateChanges.next();
    }
  }

  private _coerceBooleanProperty(value: boolean): boolean {
    return value != null && `${value}` !== 'false';
  }

  private _focusSearchboxOrResultsElement(focus = true): void {
    if (!this.isSearchboxHidden) {
      setTimeout(() => {
        if (this.searchInput?.nativeElement && focus) {
          this.searchInput.nativeElement.focus();
        }
      });
    } else if (this.resultsElement) {
      this.resultsElement.focus();
    }
  }

  private _focus(state: boolean): void {
    if (!state && this.focused) {
      this.focused = state;
      this.blur.emit(this);
    } else if (state && !this.focused) {
      this.focused = state;
      this.focus.emit(this);
    }
  }

  private setControl(ctr: NgControl = this._control): void {
    if (ctr) {
      if (ctr instanceof FormControlName) {
        this.control = ctr.control;
      } else {
        this.control = ctr as unknown as AbstractControl;
      }
    }
  }

  reset(e: MouseEvent): void {
    if (!this.option) {
      return;
    }
    let options: [] | null;

    if (this.multiple) {
      options = [];
      this.exceededItemsCount();
    } else {
      options = null;
    }

    this.option = options;
    this.value = options as Select2UpdateValue;
    this.searchText = '';

    if (this.control && this.control instanceof FormControlDirective) {
      this.control.control?.setValue(this.option);
    } else {
      this.control?.setValue(this.option);
    }

    this.resetExceedAmount();

    this.update.emit({
      component: this,
      value: options as Select2UpdateValue,
      options: options as Select2Option[],
    });

    e.preventDefault();
    e.stopPropagation();
  }

  resetExceedAmount(): void {
    if (this.showExceeded && this.exceedAmount > 0) {
      this.exceedAmount = 0;
      this.showExceeded = false;
    }
  }

  markChecked(option: Select2Option): boolean {
    const index = (this.option as Select2Option[]).findIndex(
      (op) => op.value === option.value,
    );
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  }

  markAsMain(option: Select2Option): void {
    let index = (this.option as Select2Option[]).findIndex(
      (op) => op.value === option.value,
    );

    if (index === -1) {
      this.click(option);
      index = (this.option as Select2Option[]).findIndex(
        (op) => op.value === option.value,
      );
    }

    if (index !== -1) {
      for (const op of this.option as Select2Option[]) {
        if (op?.main && op?.main === true) {
          delete op.main;
        }
      }
      (this.option as Select2Option[])[index].main = true;
    }

    this.update.emit({
      component: this,
      value: this.option as unknown as Select2UpdateValue,
      options: this.option as Select2Option[],
    });
  }

  selectIcon(option: Select2Option): string {
    const index = (this.option as Select2Option[]).findIndex(
      (op) => op.value === option.value,
    );
    if (index !== -1 && option?.main === true) {
      return 'vr vr-principal_preenchido';
    } else {
      return 'vr vr-principal';
    }
  }

  exceededItemsCount(): void {
    if (this.maxVisibleItem <= 0) {
      this.maxVisibleItem = 1;
    }

    const exceeded =
      this.option && Array.isArray(this.option)
        ? this.option.length - this.maxVisibleItem
        : 0;

    if (exceeded > 0) {
      this.showExceeded = true;
      this.exceedAmount = exceeded;
    } else {
      this.showExceeded = false;
      this.exceedAmount = 0;
    }
  }

  externalSearch(e: MouseEvent): void {
    e.stopPropagation();
    this.externalSearchEvent$.emit();
  }

  private _isAbobeOverlay(): boolean {
    return this.overlay && this._overlayPosition && this.listPosition === 'auto'
      ? this._overlayPosition === 'top'
      : this.listPosition === 'above';
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    window.document.body.removeEventListener('click', this._clickDetectionFc);
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
