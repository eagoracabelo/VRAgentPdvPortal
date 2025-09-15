import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { DatePipe } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { KeyboardCode } from '../../../shared/keyboard/keyboard-code';
import { isDate, validateDateDDMMYYYY } from '../../../shared/utils/utils';
import { VrInputField } from '../../../shared/vr-element-field/vr-input-field';
import imaskDatetimeOptions from '../date-time-imask-options';
import { IDates } from '../interfaces/dates.interface';
import { Dates } from './dates';
import { ECalendarPosition } from './vr-calendar-position';

@Directive()
export abstract class VrDatepicker extends VrInputField<Dates | null> {
  @Input() useNonWorkingDays = false;
  @Input() isDateRange: boolean = false;
  @Input() isDateTime: boolean = false;
  @Input() showShortcuts: boolean = false;
  @Input() calendarPosition: ECalendarPosition = ECalendarPosition.BOTTOM;
  @Input() disablePastDates = false;
  @Input() isMonthSelection = false;
  @Output() valueText$ = new EventEmitter<string>();

  value$ = new BehaviorSubject<IDates | null>(null);

  isHiddenCalendar = true;
  datepickerHeight = 0;

  private _valueText = '';

  @Input() override set value(dates: Dates) {
    if (dates) {
      this.setValueTextFormat(dates);
      this.innerValue = dates;
      this.value$.next(dates);
      this.onChange(dates);
      this.validateDates();
    }
  }

  get valueText(): string {
    return this._valueText;
  }

  get valueTextStart(): string {
    return this._valueText.split('-')[0];
  }

  get valueTextEnd(): string {
    return this._valueText.split('-')[1];
  }

  get innerValueDates(): Dates {
    return new Dates(this.innerValue as Dates);
  }

  setControlErrors(errors: ValidationErrors | null): void {
    this.control?.setErrors(errors);
  }

  checkInvalidDate(date: Date | string | undefined): boolean {
    return !date || !isDate(date);
  }

  hasNotBothDates(dates: Dates): boolean {
    return !dates.start && !dates.end;
  }

  hasMissingDate(dates: Dates): boolean {
    return (!!dates.start && !dates.end) || (!dates.start && !!dates.end);
  }

  hasInvalidDate(dates: Dates): boolean {
    return (
      this.checkInvalidDate(dates.start) || this.checkInvalidDate(dates.end)
    );
  }

  hasInvalidDateRange(dates: Dates): boolean {
    return !!dates.start && !!dates.end && dates.start > dates.end;
  }

  getDateRangeError(dates: Dates): ValidationErrors | null {
    let errors: ValidationErrors | null = null;

    if (this.hasNotBothDates(dates) && this.isRequired) {
      errors = { required: true };
    } else if (this.hasMissingDate(dates)) {
      errors = { startAndEndDateRequired: true };
    } else if (this.hasInvalidDate(dates)) {
      errors = { invalidfield: true };
    } else if (this.hasInvalidDateRange(dates)) {
      errors = { startAndEndDateInvalid: true };
    }

    return errors;
  }

  getDateError(dates: Dates): ValidationErrors | null {
    let errors: ValidationErrors | null = null;

    if (!dates.start && this.isRequired) {
      errors = { required: true };
    } else if (!!dates.start && this.checkInvalidDate(dates.start)) {
      errors = { invalidfield: true };
    }

    return errors;
  }

  validateDates(): void {
    const dates = this.innerValueDates;
    let errors: ValidationErrors | null = null;

    if (this.isDateRange) {
      errors = this.getDateRangeError(dates);
    } else {
      errors = this.getDateError(dates);
    }

    this.setControlErrors(errors);
  }

  getExpectedLength(): number {
    let expectedLength = 10;

    if (this.isDateTime) {
      expectedLength = 16;
    } else if (this.isMonthSelection) {
      expectedLength = 7;
    }

    return expectedLength;
  }

  getDateFromStringOrDateTime(
    stringDate: string | undefined | null,
  ): Date | undefined {
    let date: Date | undefined = undefined;

    if (!stringDate) {
      date = undefined;
    } else if (this.isDateTime) {
      date = imaskDatetimeOptions.parse(stringDate);
    } else {
      date = this.getDateFromString(stringDate);
    }

    return date;
  }

  setStartDate(stringDate: string): void {
    const dates: Dates = this.innerValueDates;

    if (!stringDate || stringDate.length === this.getExpectedLength()) {
      dates.start = this.getDateFromStringOrDateTime(stringDate);
      this.value = dates;
    } else {
      this.setControlErrors({ invalidfield: true });
    }
  }

  setEndDate(stringDate: string): void {
    const dates: Dates = this.innerValueDates;

    if (!stringDate || stringDate.length === this.getExpectedLength()) {
      dates.end = this.getDateFromStringOrDateTime(stringDate);
      this.value = dates;
    } else {
      this.setControlErrors({ invalidfield: true });
    }
  }

  openCalendar(): void {
    this.isHiddenCalendar = !this.isHiddenCalendar;
  }

  hiddenCalendar(): void {
    this.isHiddenCalendar = true;
  }

  selectDate(dates: Dates): void {
    this.value = dates;
  }

  @HostListener('keyup', ['$event'])
  onKeyup(keyup: KeyboardEvent): void {
    const code = keyup.code;
    if (code === KeyboardCode.TAB || code === KeyboardCode.BACKSPACE) {
      keyup.preventDefault();
      return;
    }

    const target = keyup.target as EventTarget & { className: string };

    if (code === KeyboardCode.KEY_D) {
      if (target.className.includes('start-date')) {
        this.setTodayValue('start', true);
      }

      if (target.className.includes('end-date')) {
        this.setTodayValue('end', true);
      }
    }
  }

  @HostListener('keydown.c', ['$event'])
  onKeyDownCEvent(event: Event): void {
    if (!this.isDisabled && !this.isReadOnly) {
      this.openCalendar();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('keydown.h', ['$event'])
  onKeyDownHEvent(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.onKeysEventSetDate(target);

    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('keydown.enter', ['$event'])
  onKeyDownEnterEvent(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.value) {
      const clearValue = target.value?.replace(/\D/g, '');
      const addDays = Number(clearValue);
      if (!Number.isNaN(addDays) && addDays <= 999) {
        this.onKeysEventSetDate(target, addDays);
        target.focus();
      }
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private onKeysEventSetDate(target: HTMLInputElement, addDays?: number): void {
    if (!this.isDateRange) {
      this.setTodayValue('start', false, addDays);
    } else {
      if (target.className.includes('start-date')) {
        this.setTodayValue('start', false, addDays);
      }

      if (target.className.includes('end-date')) {
        this.setTodayValue('end', false, addDays);
      }
    }
  }

  private setTodayValue(
    dateType: string,
    resetTime: boolean,
    addDays?: number,
  ): void {
    const today = new Date();

    if (resetTime) {
      today.setHours(0, 0, 0, 0);
    }

    if (addDays && addDays > 0) {
      today.setDate(today.getDate() + addDays);
    }

    if (dateType === 'start') {
      const dates = this.innerValueDates;
      dates.start = today;
      this.value = dates;
    }

    if (dateType === 'end') {
      const dates = this.innerValueDates;
      dates.end = today;
      this.value = dates;
    }
  }

  transform(date: Date, mask = 'dd/MM/yyyy'): string {
    const _datePipe = new DatePipe('pt-BR');

    return _datePipe.transform(date, mask) as string;
  }

  private setValueTextFormat(dates: Dates): void {
    let formattedDates = '';

    if (dates.start) {
      let mask = 'dd/MM/yyyy';

      if (this.isDateTime) {
        mask = 'dd/MM/yyyy HH:mm';
      } else if (this.isMonthSelection) {
        mask = 'MM/yyyy';
      }

      formattedDates = this.transform(dates.start, mask);
    }

    if (this.isDateRange) {
      if (dates.end) {
        formattedDates += `-${this.transform(dates.end)}`;
      } else {
        formattedDates += '-';
      }
    }

    this.valueText$.emit(formattedDates);
    this._valueText = formattedDates;
  }

  private getDateFromString(stringDate: string): Date | undefined {
    const splittedDate = stringDate.split('/');
    let date = undefined;

    if (splittedDate.length === 3) {
      const day = +splittedDate[0];
      const month = +splittedDate[1];
      const year = +splittedDate[2];

      if (validateDateDDMMYYYY(day, month, year)) {
        date = new Date(year, month - 1, day, 0, 0, 0, 0);
      }
    } else if (splittedDate.length === 2 && this.isMonthSelection) {
      const month = +splittedDate[0];
      const year = +splittedDate[1];

      if (validateDateDDMMYYYY(1, month, year)) {
        date = new Date(year, month - 1, 1, 0, 0, 0, 0);
      }
    }

    return date;
  }
}
