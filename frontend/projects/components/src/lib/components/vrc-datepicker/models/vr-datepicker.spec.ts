import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Dates } from './dates';
import { VrDatepicker } from './vr-datepicker';

registerLocaleData(localePt, 'pt-BR');

@Component({})
class ComponentTest extends VrDatepicker {}

describe(`${VrDatepicker.name}`, () => {
  let component: ComponentTest;
  let fixture: ComponentFixture<ComponentTest>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentTest],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invert openCalendar value', () => {
    expect(component.isHiddenCalendar).toBeTrue();
    component.openCalendar();
    expect(component.isHiddenCalendar).toBeFalse();
  });

  it('should set isHiddenCalendar to true', () => {
    expect(component.isHiddenCalendar).toBeTrue();
    component.openCalendar();
    expect(component.isHiddenCalendar).toBeFalse();
    component.hiddenCalendar();
    expect(component.isHiddenCalendar).toBeTrue();
  });

  it('should select date', () => {
    const dates = new Dates();
    dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);

    const spyValueText = spyOn(component.valueText$, 'emit');
    const spyValue = spyOn(component.value$, 'next');

    component.selectDate(dates);

    const expectedFormattedDate = '01/05/2022';

    expect(component.valueText).toEqual(expectedFormattedDate);
    expect(spyValueText).toHaveBeenCalledWith(expectedFormattedDate);
    expect(spyValue).toHaveBeenCalledWith(dates);
  });

  describe('setControlErrors', () => {
    it('should set errors on control when control exists', () => {
      const mockControl = new FormControl();
      const errors: ValidationErrors = { required: true };

      component.control = mockControl;
      const setErrorsSpy = spyOn(mockControl, 'setErrors');

      component.setControlErrors(errors);

      expect(setErrorsSpy).toHaveBeenCalledWith(errors);
    });

    it('should not set errors when control is null', () => {
      component.control = null;

      expect(() =>
        component.setControlErrors({ required: true }),
      ).not.toThrow();
    });
  });

  describe('checkInvalidDate', () => {
    it('should return true for undefined date', () => {
      expect(component.checkInvalidDate(undefined)).toBeTrue();
    });

    it('should return true for null date', () => {
      expect(component.checkInvalidDate(null as any)).toBeTrue();
    });

    it('should return true for invalid date', () => {
      const invalidDate = 'aaaa';
      expect(component.checkInvalidDate(invalidDate)).toBeTrue();
    });

    it('should return false for valid date', () => {
      const validDate = new Date(2022, 4, 1);
      expect(component.checkInvalidDate(validDate)).toBeFalse();
    });
  });

  describe('hasNotBothDates', () => {
    it('should return true when both start and end dates are missing', () => {
      const dates = new Dates();
      expect(component.hasNotBothDates(dates)).toBeTrue();
    });

    it('should return false when start date exists', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      expect(component.hasNotBothDates(dates)).toBeFalse();
    });

    it('should return false when end date exists', () => {
      const dates = new Dates();
      dates.end = new Date(2022, 4, 1);
      expect(component.hasNotBothDates(dates)).toBeFalse();
    });

    it('should return false when both dates exist', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      dates.end = new Date(2022, 4, 2);
      expect(component.hasNotBothDates(dates)).toBeFalse();
    });
  });

  describe('hasMissingDate', () => {
    it('should return true when only start date exists', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      expect(component.hasMissingDate(dates)).toBeTrue();
    });

    it('should return true when only end date exists', () => {
      const dates = new Dates();
      dates.end = new Date(2022, 4, 1);
      expect(component.hasMissingDate(dates)).toBeTrue();
    });

    it('should return false when both dates exist', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      dates.end = new Date(2022, 4, 2);
      expect(component.hasMissingDate(dates)).toBeFalse();
    });

    it('should return false when neither date exists', () => {
      const dates = new Dates();
      expect(component.hasMissingDate(dates)).toBeFalse();
    });
  });

  describe('hasInvalidDate', () => {
    it('should return true when start date is invalid', () => {
      const dates = new Dates();
      dates.start = new Date('invalid-date');
      expect(component.hasInvalidDate(dates)).toBeTrue();
    });

    it('should return true when end date is invalid', () => {
      const dates = new Dates();
      dates.end = new Date('invalid-date');
      expect(component.hasInvalidDate(dates)).toBeTrue();
    });

    it('should return false when both dates are valid', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      dates.end = new Date(2022, 4, 2);
      expect(component.hasInvalidDate(dates)).toBeFalse();
    });
  });

  describe('hasInvalidDateRange', () => {
    it('should return true when start date is after end date', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 2);
      dates.end = new Date(2022, 4, 1);
      expect(component.hasInvalidDateRange(dates)).toBeTrue();
    });

    it('should return false when start date is before end date', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      dates.end = new Date(2022, 4, 2);
      expect(component.hasInvalidDateRange(dates)).toBeFalse();
    });

    it('should return false when start date equals end date', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      dates.end = new Date(2022, 4, 1);
      expect(component.hasInvalidDateRange(dates)).toBeFalse();
    });

    it('should return false when start date is missing', () => {
      const dates = new Dates();
      dates.end = new Date(2022, 4, 1);
      expect(component.hasInvalidDateRange(dates)).toBeFalse();
    });

    it('should return false when end date is missing', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      expect(component.hasInvalidDateRange(dates)).toBeFalse();
    });
  });

  describe('getDateRangeError', () => {
    beforeEach(() => {
      component.control = new FormControl();
    });

    it('should return required error when no dates and field is required', () => {
      component.isRequired = true;
      const dates = new Dates();

      const result = component.getDateRangeError(dates);

      expect(result).toEqual({ required: true });
    });

    it('should return startAndEndDateRequired error when only one date is provided', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);

      const result = component.getDateRangeError(dates);

      expect(result).toEqual({ startAndEndDateRequired: true });
    });

    it('should return invalidfield error when dates are invalid', () => {
      const dates = new Dates();
      dates.start = 'invalid-date' as any;
      dates.end = new Date(2022, 4, 1);

      const result = component.getDateRangeError(dates);

      expect(result).toEqual({ invalidfield: true });
    });

    it('should return startAndEndDateInvalid error when date range is invalid', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 2);
      dates.end = new Date(2022, 4, 1);

      const result = component.getDateRangeError(dates);

      expect(result).toEqual({ startAndEndDateInvalid: true });
    });

    it('should return null when dates are valid', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);
      dates.end = new Date(2022, 4, 2);

      const result = component.getDateRangeError(dates);

      expect(result).toBeNull();
    });
  });

  describe('getDateError', () => {
    beforeEach(() => {
      component.control = new FormControl();
    });

    it('should return required error when no start date and field is required', () => {
      component.isRequired = true;
      const dates = new Dates();

      const result = component.getDateError(dates);

      expect(result).toEqual({ required: true });
    });

    it('should return invalidfield error when start date is invalid', () => {
      const dates = new Dates();
      dates.start = 'invalid-date' as any;

      const result = component.getDateError(dates);

      expect(result).toEqual({ invalidfield: true });
    });

    it('should return null when start date is valid', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1);

      const result = component.getDateError(dates);

      expect(result).toBeNull();
    });

    it('should return null when no start date and field is not required', () => {
      component.isRequired = false;
      const dates = new Dates();

      const result = component.getDateError(dates);

      expect(result).toBeNull();
    });
  });

  describe('validateDates', () => {
    beforeEach(() => {
      component.control = new FormControl();
    });

    it('should validate date range when isDateRange is true', () => {
      component.isDateRange = true;
      component.isRequired = true;
      const dates = new Dates();

      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.validateDates();

      expect(setErrorsSpy).toHaveBeenCalledWith({ required: true });
    });

    it('should validate single date when isDateRange is false', () => {
      component.isDateRange = false;
      component.isRequired = true;
      const dates = new Dates();

      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.validateDates();

      expect(setErrorsSpy).toHaveBeenCalledWith({ required: true });
    });
  });

  describe('getExpectedLength', () => {
    it('should return 10 for default date format', () => {
      expect(component.getExpectedLength()).toBe(10);
    });

    it('should return 16 for datetime format', () => {
      component.isDateTime = true;
      expect(component.getExpectedLength()).toBe(16);
    });

    it('should return 7 for month selection format', () => {
      component.isMonthSelection = true;
      expect(component.getExpectedLength()).toBe(7);
    });

    it('should prioritize datetime over month selection', () => {
      component.isDateTime = true;
      component.isMonthSelection = true;
      expect(component.getExpectedLength()).toBe(16);
    });
  });

  describe('getDateFromStringOrDateTime', () => {
    it('should return undefined for null input', () => {
      const result = component.getDateFromStringOrDateTime(null);
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      const result = component.getDateFromStringOrDateTime(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = component.getDateFromStringOrDateTime('');
      expect(result).toBeUndefined();
    });

    it('should parse datetime when isDateTime is true', () => {
      component.isDateTime = true;
      const dateString = '01/05/2022 14:30';

      const result = component.getDateFromStringOrDateTime(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(1);
      expect(result?.getMonth()).toBe(4); // May is month 4 (0-indexed)
      expect(result?.getFullYear()).toBe(2022);
    });

    it('should parse regular date when isDateTime is false', () => {
      component.isDateTime = false;
      const dateString = '01/05/2022';

      const result = component.getDateFromStringOrDateTime(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getDate()).toBe(1);
      expect(result?.getMonth()).toBe(4);
      expect(result?.getFullYear()).toBe(2022);
    });
  });

  describe('setStartDate', () => {
    beforeEach(() => {
      component.control = new FormControl();
    });

    it('should set start date when string length matches expected length', () => {
      const dateString = '01/05/2022';
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setStartDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalled();
      expect(component.control?.errors).toEqual(null);
    });

    it('should set start date when string is empty', () => {
      const dateString = '';
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setStartDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalled();
      expect(component.control?.errors).toEqual(null);
    });

    it('should set invalidfield error when string length does not match', () => {
      const dateString = '01/05/22'; // Too short
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setStartDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalledWith({ invalidfield: true });
    });

    it('should set date if monthSelection is true', () => {
      component.isMonthSelection = true;
      const dateString = '05/2022';
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setStartDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalled();
      expect(component.control?.errors).toEqual(null);
    });

    it('should set date if datetime is true', () => {
      component.isDateTime = true;
      const dateString = '01/05/2022 14:30';
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setStartDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalled();
      expect(component.control?.errors).toEqual(null);
    });
  });

  describe('setEndDate', () => {
    beforeEach(() => {
      component.control = new FormControl();
    });

    it('should set end date when string length matches expected length', () => {
      const dateString = '01/05/2022';
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setEndDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalled();
      expect(component.control?.errors).toEqual(null);
    });

    it('should set end date when string is empty', () => {
      const dateString = '';
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setEndDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalled();
      expect(component.control?.errors).toEqual(null);
    });

    it('should set invalidfield error when string length does not match', () => {
      const dateString = '01/05/22'; // Too short
      const setErrorsSpy = spyOn(component.control!, 'setErrors');

      component.setEndDate(dateString);

      expect(setErrorsSpy).toHaveBeenCalledWith({ invalidfield: true });
    });
  });

  describe('onKeyup', () => {
    it('should call preventDefault when "TAB" is typed', () => {
      const keyUp = {
        code: 'Tab',
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.onKeyup(keyUp);
    });

    it('should call preventDefault when "BACKSPACE" is typed', () => {
      const keyUp = {
        code: 'Backspace',
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.onKeyup(keyUp);
    });

    it('should set today value for start date when "D" is typed', () => {
      const keyUp = {
        code: 'KeyD',
        target: { className: 'start-date' },
      } as unknown as KeyboardEvent;

      const dates = new Dates();

      const spyValueText = spyOn(component.valueText$, 'emit');
      const spyValue = spyOn(component.value$, 'next');

      component.onKeyup(keyUp);

      const day =
        dates.today.getDate() < 10
          ? '0' + dates.today.getDate()
          : dates.today.getDate();

      const expectedFormattedDate = `${day}/${
        dates.today.getMonth() + 1 >= 10
          ? dates.today.getMonth() + 1
          : '0' + (dates.today.getMonth() + 1)
      }/${dates.today.getFullYear()}`;

      expect(component.valueText).toEqual(expectedFormattedDate);
      expect(spyValueText).toHaveBeenCalledWith(expectedFormattedDate);
      expect(spyValue).toHaveBeenCalled();
    });

    it('should set today value for end date when "D" is typed', () => {
      const keyUp = {
        code: 'KeyD',
        target: { className: 'end-date' },
      } as unknown as KeyboardEvent;

      const dates = new Dates();
      dates.end = dates.today;

      component.isDateRange = true;

      const spyValueText = spyOn(component.valueText$, 'emit');
      const spyValue = spyOn(component.value$, 'next');

      component.onKeyup(keyUp);

      const day =
        dates.today.getDate() < 10
          ? '0' + dates.today.getDate()
          : dates.today.getDate();

      const expectedFormattedDate = `-${day}/${
        dates.today.getMonth() + 1 >= 10
          ? dates.today.getMonth() + 1
          : '0' + (dates.today.getMonth() + 1)
      }/${dates.today.getFullYear()}`;

      expect(component.valueText).toEqual(expectedFormattedDate);
      expect(spyValueText).toHaveBeenCalledWith(expectedFormattedDate);
      expect(spyValue).toHaveBeenCalledWith(dates);
    });

    it('should set today value for end date when "D" is typed', () => {
      const keyUp = {
        code: 'KeyD',
        target: { className: 'end-date' },
      } as unknown as KeyboardEvent;

      const dates = new Dates();
      dates.start = new Date(
        dates.today.getFullYear(),
        dates.today.getMonth() - 1,
        dates.today.getDate(),
        0,
        0,
        0,
        0,
      );

      component.value = dates;

      dates.end = dates.today;

      component.isDateRange = true;

      const spyValueText = spyOn(component.valueText$, 'emit');
      const spyValue = spyOn(component.value$, 'next');

      component.onKeyup(keyUp);
      const today =
        dates.today.getDate() <= 10
          ? '0' + dates.today.getDate()
          : dates.today.getDate();

      const expectedFormattedDate = `${dates.transform(
        dates.start,
      )}-${dates.transform(dates.today)}`;

      expect(component.valueText).toEqual(expectedFormattedDate);
      expect(spyValueText).toHaveBeenCalledWith(expectedFormattedDate);
      expect(spyValue).toHaveBeenCalledWith(dates);
    });

    it('should do nothing when any other key is used', () => {
      const keyUp = {
        code: 'KeyY',
      } as unknown as KeyboardEvent;

      const spyValueText = spyOn(component.valueText$, 'emit');
      const spyValue = spyOn(component.value$, 'next');

      component.onKeyup(keyUp);

      expect(spyValueText).not.toHaveBeenCalled();
      expect(spyValue).not.toHaveBeenCalled();
    });
  });

  describe('valueTextStart and valueTextEnd', () => {
    it('should get valueTextStart', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);

      component.isDateRange = true;
      component.value = dates;

      expect(component.valueTextStart).toEqual('01/05/2022');
    });

    it('should get valueTextEnd', () => {
      const dates = new Dates();
      dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);
      dates.end = new Date(2022, 5, 1, 0, 0, 0, 0);

      component.isDateRange = true;
      component.value = dates;

      expect(component.valueTextEnd).toEqual('01/06/2022');
    });

    it('should valueTextStart and valueTextEnd return empty string when where is no data selected', () => {
      const dates = new Dates();

      component.isDateRange = true;
      component.value = dates;

      expect(component.valueTextStart).toEqual('');
      expect(component.valueTextEnd).toEqual('');
    });
  });

  describe('onKeyC', () => {
    it('should be openCalendar called', () => {
      const spy = spyOn(component, 'openCalendar');
      const keyC = {
        target: {
          className: 'start-date',
        },
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
        stopPropagation: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.onKeyDownCEvent(keyC);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onKeyH', () => {
    it('should set today value for start date when "H" is typed - simple datepicker', () => {
      const keyH = {
        code: 'KeyH',
        target: { className: 'start-date' },
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
        stopPropagation: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.onKeyDownHEvent(keyH);

      expect(component.valueText).toBeDefined();
    });

    it('should set today value for start date when "H" is typed - date range', () => {
      const keyH = {
        code: 'KeyH',
        target: { className: 'start-date' },
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
        stopPropagation: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.isDateRange = true;
      component.onKeyDownHEvent(keyH);

      expect(component.valueText).toBeDefined();
    });

    it('should set today value for end date when "H" is typed - date range', () => {
      const keyH = {
        code: 'KeyH',
        target: { className: 'end-date' },
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
        stopPropagation: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.isDateRange = true;
      component.onKeyDownHEvent(keyH);

      expect(component.valueText).toBeDefined();
    });
  });

  describe('onKeyDownEnterEvent', () => {
    it('should set today value for start date when "Enter" is typed - no target value', () => {
      const keyEnter = {
        code: 'Enter',
        target: { className: 'start-date' },
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
        stopPropagation: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.onKeyDownEnterEvent(keyEnter);

      expect(component.valueText).toBe('');
    });

    it('should set today value for start date when "Enter" is typed - target value', () => {
      const keyEnter = {
        code: 'Enter',
        target: {
          className: 'start-date',
          value: '01',
          focus: () => {},
        },
        preventDefault: (a = '') => {
          expect(a).toBeDefined();
        },
        stopPropagation: (a = '') => {
          expect(a).toBeDefined();
        },
      } as unknown as KeyboardEvent;

      component.onKeyDownEnterEvent(keyEnter);

      expect(component.valueText.length).toBeGreaterThan(0);
    });
  });
});
