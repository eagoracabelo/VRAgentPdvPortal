import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Provider,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import {
  COMPOSITION_BUFFER_MODE,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import IMask, { InputMask } from 'imask';

import imaskDateOptions from './date-imask-options';
import imaskDateMonthOptions from './date-month-imask-options';
import imaskDatetimeOptions from './date-time-imask-options';

type Opts = typeof imaskDateOptions;
const getElement = (
  elementRef: ElementRef<HTMLInputElement>,
): HTMLInputElement => elementRef.nativeElement;
const isAndroid = (): boolean =>
  /android (\d+)/.test(navigator.userAgent.toLowerCase());

export const MASKEDDATEINPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateMaskDirective),
  multi: true,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_IMASK_ELEMENT = (
  elementRef: ElementRef<HTMLElement>,
): HTMLElement => elementRef.nativeElement;

@Directive({
  selector: '[vrc-datemask]',
  exportAs: 'vrc-datemask',
  providers: [MASKEDDATEINPUT_VALUE_ACCESSOR],
})
export class DateMaskDirective
  implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy
{
  imask = imaskDateOptions;

  protected maskRef!: InputMask<Opts>;

  private readonly _accept = new EventEmitter<unknown>();
  private readonly _complete = new EventEmitter<unknown>();

  private _viewInitialized = false;
  private _writing = false;
  private _composing = false;

  private _writingValue: unknown;

  @Input()
  set isDateTime(is: boolean) {
    if (is) {
      this.imask = imaskDatetimeOptions;
    }
  }

  @Input()
  set isMonthSelection(is: boolean) {
    if (is) {
      this.imask = imaskDateMonthOptions;
    }
  }

  constructor(
    private readonly _elementRef: ElementRef<HTMLInputElement>,
    private readonly _renderer: Renderer2,
    @Optional()
    @Inject(COMPOSITION_BUFFER_MODE)
    private readonly _compositionMode: boolean,
  ) {
    if (this._compositionMode == null) {
      this._compositionMode = !isAndroid();
    }
  }

  get element(): HTMLInputElement {
    return getElement(this._elementRef);
  }

  get maskValue(): string {
    if (!this.maskRef && this.element) {
      return this.element.value;
    }
    return this.maskRef.value;
  }

  set maskValue(value: string) {
    if (this.maskRef) {
      this.maskRef.value = value;
    } else {
      this._renderer.setProperty(this.element, 'value', value);
    }
  }

  registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  protected onChange(_: unknown): void {
    /* Empty */
  }

  protected onTouched(_?: unknown): void {
    /* Empty */
  }

  writeValue(value: string | null | undefined): void {
    value = value ?? '';
    if (this.maskRef) {
      this.beginWrite(value);

      if (
        this.maskValue !== value ||
        (typeof value !== 'string' &&
          this.maskRef.value === '' &&
          !this.maskRef.el.isActive)
      ) {
        this.maskValue = value;
      }
    } else {
      this._renderer.setProperty(this.element, 'value', value);
    }
  }

  ngAfterViewInit(): void {
    if (this.imask) {
      this.initMask();
    }

    this._viewInitialized = true;
  }

  private initMask(): void {
    if (this.element) {
      this.maskRef = IMask(this.element, this.imask)
        .on('accept', this.onAccept.bind(this))
        .on('complete', this.onComplete.bind(this));
    }
  }

  private onAccept(): void {
    const value = this.maskValue;
    if (this._writing && value === this.endWrite()) {
      return;
    }
    this.onChange(value);
    this._accept.emit(value);
  }

  private onComplete(): void {
    this._complete.emit(this.maskValue);
  }

  beginWrite(value: unknown): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite(): unknown {
    this._writing = false;
    return this._writingValue;
  }

  ngOnChanges(changes: SimpleChanges & { imask: unknown }): void {
    if (!changes?.imask || !this._viewInitialized) {
      return;
    }

    if (this.imask) {
      if (this.maskRef) {
        this.maskRef.updateOptions(this.imask);
      } else {
        this.initMask();
        this.onChange(this.maskValue);
      }
    } else {
      this.destroyMask();
    }
  }

  @HostListener('compositionstart')
  compositionStart(): void {
    this._composing = true;
  }

  @HostListener('compositionend', ['$event.target.value'])
  compositionEnd(value: unknown): void {
    this._composing = false;
    if (this._compositionMode) {
      this.handleInput(value);
    }
  }

  handleInput(value: unknown): void {
    if (
      (!this.maskRef && !this._compositionMode) ||
      (this._compositionMode && !this._composing)
    ) {
      this.onChange(value);
    }
  }

  ngOnDestroy(): void {
    this.destroyMask();
    this._accept.complete();
    this._complete.complete();
  }

  destroyMask(): void {
    if (this.maskRef) {
      this.maskRef.destroy();
    }
  }
}
