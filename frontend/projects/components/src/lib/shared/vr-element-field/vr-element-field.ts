/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControlStatus,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ITooltip } from '../interfaces/tooltip.interface';

import { getRandomId } from '../utils/utils';

@Directive()
export class VrElementField<T = unknown>
  implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy
{
  @Input() id = getRandomId();
  @Input() classeCss!: string;
  @Input() name = '';

  @Input() control!: AbstractControl<unknown, unknown> | null;
  @Input() formControlName!: string;

  @Input() hideLabel = false;
  @Input() hideErrorMessage = false;
  @Input() showTimeIcon = false;
  @Input() tooltip!: ITooltip;
  @Input() tooltipSideError = false;
  @Input() tooltipOverlay = false;
  @Input() tooltipBottomRight: boolean = true;
  @Input() tooltipBottomLeft: boolean = false;
  @Input() tooltipTopRight: boolean = false;
  @Input() tooltipTopLeft: boolean = false;

  @Output() onBlurEvent = new EventEmitter();
  @Output() onFocusEvent = new EventEmitter();

  isError = false;

  protected innerValue!: T;

  private _sub!: Subscription;

  protected _disabled = false;
  protected _required = false;
  protected _readonly = false;

  @Input() set value(v: T) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  get value(): unknown {
    return this.innerValue;
  }

  get isReadOnly(): boolean {
    return this._readonly;
  }

  @Input()
  set isReadOnly(v: boolean) {
    this._readonly = v;
  }

  get isDisabled(): boolean {
    return this._disabled;
  }

  @Input()
  set isDisabled(v: boolean) {
    this._disabled = v;
  }

  get isRequired(): boolean {
    return this._required;
  }

  @Input()
  set isRequired(v: boolean) {
    this._required = v;
  }

  ngOnInit(): void {
    this.initStatusChanges();
  }

  ngAfterViewInit(): void {
    this.setRequiredState();
  }

  protected onChange(_: unknown): void {
    /*Empty*/
  }

  onTouched(_?: unknown): void {
    const element = document.getElementById(`${this.id}-fieldRequired`);
    element?.classList.remove('required');
  }

  writeValue(v: T): void {
    this.value = v;
  }

  registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  registerOnTouched(_: VoidFunction): void {
    /*Empty*/
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setRequiredState(): void {
    if (this.control) {
      const validator = this.control?.validator;
      const validators =
        typeof validator === 'function' ? validator(this.control) : null;
      if (validators && Object.hasOwn(validators, 'required')) {
        this.isRequired = !!validators?.['required'];
      } else {
        this.isRequired = false;
      }
    }
  }

  onBlur(): void {
    this.onBlurEvent.emit();
    this.onTouched();
    if (this.control) {
      this.resetStatusError();
      this.actionsForError();
    }
  }

  onFocus(): void {
    this.onFocusEvent.emit();
  }

  onSelectChange(value: unknown): void {
    this.onChange(value);
  }

  initStatusChanges(): void {
    const sub = this.control?.statusChanges.subscribe(
      (status: FormControlStatus) => {
        this.checkHasError(status);
      },
    );

    if (sub) {
      this._sub = sub;
    }
  }

  checkHasError(status: FormControlStatus): void {
    this.resetStatusError();

    if (status === 'INVALID') {
      const element = document.getElementById(`${this.id}-fieldRequired`);

      element?.classList.remove('required');
      this.actionsForError();
    }
  }

  protected resetStatusError(): void {
    /*Empty*/
  }

  protected actionsForError(): void {
    /*Empty*/
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  verifyHasValue(): void {
    const element = document.getElementById(`${this.id}-fieldRequired`);

    const formValues = this.control?.value;

    if (formValues) {
      element?.classList.remove('required');
    }
  }

  changeWhenWrote(event: unknown): void {
    const element = document.getElementById(`${this.id}-fieldRequired`);

    if (event) {
      element?.classList.remove('required');
    } else {
      element?.classList.add('required');
    }
  }
}
