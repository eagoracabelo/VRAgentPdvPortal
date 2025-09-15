import { Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { VrInputDatalist } from '../../../shared/datalist/vr-input-datalist';
import { VrcOptionComponent } from '../../vrc-option';

@Directive()
export abstract class VrAutocomplete extends VrInputDatalist {
  @ViewChild('autocompleteInputRef') autocompleteInputRef!: ElementRef;
  @ViewChild('autocompleteListOptionsRef')
  autocompleteListOptionsRef!: ElementRef;

  @Input() enableCalcListOptionsTopPosition = false;
  @Input() selectWhenItMatchs = true;

  isOpen = false;

  private _text: string | undefined = '';
  private timeout: unknown;
  private timeoutDatalist: unknown;

  @Input() set text(v: string) {
    if (v !== this._text) {
      this.value = v;
      this._text = v;
      this.match(v);
    }
  }

  get text(): unknown {
    return this._text;
  }

  get inputElement(): HTMLInputElement {
    return this.autocompleteInputRef?.nativeElement as HTMLInputElement;
  }

  get listOptionDIVElement(): HTMLDivElement {
    return this.autocompleteListOptionsRef?.nativeElement as HTMLDivElement;
  }

  isSelected(index: number): void {
    const option = this.options.find((op, i) => i === index);
    this.setOption(option);
  }

  match(value: string | undefined): void {
    if (!this.selectWhenItMatchs) return;
    for (const option of this.options) {
      if (typeof value === 'string') {
        if (option.text?.trim() === value.trim()) {
          this.setOption(option);
          return;
        }

        if (
          typeof option.value === 'string' &&
          option.value.trim() === value.trim()
        ) {
          this.setOption(option);
          return;
        }
      }
    }
  }

  setOption(option: VrcOptionComponent | undefined): void {
    const value = option?.value;
    const text = option?.text?.trim();
    this._text = text ?? value;
    this.value = value;
    this.update.emit(value);
    this.setPosition();
  }

  private set opacity(v: string) {
    if (this.autocompleteListOptionsRef) {
      const style = this.listOptionDIVElement?.style;
      style.opacity = v;
    }
  }

  onClose(): void {
    this.hiddenListOptions();
    clearTimeout(this.timeout as number);
    this.timeout = setTimeout(() => {
      this.isOpen = false;
      this.timeout = null;
    }, 180);
    this.onTouched();
    this.value = null;
    this.match(this._text);
  }

  override onBlur(): void {
    this.onClose();
    super.onBlur();
  }

  onOpen(): void {
    const isOpen = true;
    this.isCurrentInit();
    this.isOpen = isOpen;
  }

  isCurrentInit(): void {
    if (this.options) {
      this.options.map((op) => (op.isCurrent = false));
      this.scrollToTop();
      this.setPosition();
    }
  }

  scrollToTop(): void {
    if (this.autocompleteListOptionsRef) {
      const firstOption =
        this.listOptionDIVElement?.querySelector(`.datalist-option-0`);
      this.scrollToOption(firstOption);
    }
  }

  scrollIntoView(): void {
    const option = this.listOptionDIVElement?.querySelector(
      `.datalist-option-${this.isCurrent}`,
    );
    this.scrollToOption(option);
  }

  private scrollToOption(option: Element | null): void {
    if (option) {
      option.scrollIntoView({ block: 'nearest' });
    }
  }

  protected setPosition(): void {
    setTimeout(() => {
      this.setListOptionsWidth();
      this.setListOptionsTop();
    });
  }

  private setListOptionsWidth(): void {
    if (this.listOptionDIVElement) {
      const input = this.inputElement;
      this.listOptionDIVElement.style.minWidth = `${input.offsetWidth}px`;
    }
  }

  protected setListOptionsTop(): void {
    if (this.listOptionDIVElement) {
      const element = this.listOptionDIVElement;
      const style = element.style;

      if (this.enableCalcListOptionsTopPosition) {
        style.visibility = 'hidden';
        clearTimeout(this.timeoutDatalist as number);
        this.timeoutDatalist = setTimeout(() => {
          style.removeProperty('top');

          if (!this.isValidVerticalPosition(element)) {
            style.top = `-${element.offsetHeight}px`;
          }

          if (!this.isValidVerticalPosition(element)) {
            style.removeProperty('top');
          }

          style.visibility = 'initial';
          this.timeoutDatalist = null;
        }, 50);
      } else {
        style.removeProperty('top');
        style.visibility = 'initial';
        this.timeoutDatalist = null;
      }
    }
  }

  isValidVerticalPosition(element: HTMLElement): boolean {
    const elementHeight = element.offsetHeight;
    const positionTop = this.offset(element).y ?? 0;
    const windowHeight = window.innerHeight;
    return positionTop > 56 && positionTop + elementHeight < windowHeight;
  }

  private offset(element: HTMLElement): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { y: rect.top + scrollTop, x: rect.left + scrollLeft };
  }

  private hiddenListOptions(): void {
    this.opacity = '0';
  }
}
