import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { IDates } from '../interfaces/dates.interface';
import { ITimeChangeEvent } from '../interfaces/time-change.interface';
import { Dates } from '../models/dates';
import { GoogleCalendarHolidayService } from '../service/google-calendar-holiday.service';
import { VrcCalendarEventsService } from '../service/vrc-calendar-events.service';
import { VrcCalendarComponent } from './vrc-calendar.component';

registerLocaleData(localePt, 'pt-BR');

describe(`${VrcCalendarComponent.name}`, () => {
  let component: VrcCalendarComponent;
  let fixture: ComponentFixture<VrcCalendarComponent>;
  let gcService: GoogleCalendarHolidayService;

  const today = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DatePipe,
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        {
          provide: GoogleCalendarHolidayService,
          useValue: {
            getHolidaysYear: () =>
              of([
                {
                  start: { date: '2022-10-2' },
                  summary: 'Feriado',
                },
                {
                  start: { date: '2022-10-5' },
                },
              ]),
            getNonWorkingDays: () =>
              of([
                {
                  date: `${today().getDate()}/${today().getMonth()}/${today().getFullYear()}`,
                  name: 'Sem trabalho',
                },
              ]),
          },
        },
        { provide: VrcCalendarEventsService, useValue: {} },
      ],
      declarations: [VrcCalendarComponent],
    }).compileComponents();

    gcService = TestBed.inject(GoogleCalendarHolidayService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get calendarElement', () => {
    expect(component.calendarElement).toBeTruthy();
  });

  it('should close on keydown escape', () => {
    const keyUp = {
      code: 'Escape',
    } as unknown as KeyboardEvent;

    const spy = spyOn(component.emitCloseCalendar, 'emit');

    const event = new KeyboardEvent('keydown', keyUp);

    document.body.dispatchEvent(event);

    expect(component.isOpen).toEqual(false);
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT close on other keydown', () => {
    const keyUp = {
      code: 'KeyA',
    } as unknown as KeyboardEvent;

    const spy = spyOn(component.emitCloseCalendar, 'emit');

    const event = new KeyboardEvent('keydown', keyUp);

    document.body.dispatchEvent(event);

    expect(component.isOpen).toEqual(false);
    expect(spy).not.toHaveBeenCalled();
  });

  describe('get holidays', () => {
    it('should get holidays with start year', () => {
      const date = new Date(2022, 4, 1, 0, 0, 0, 0);
      const newDate: IDates = {
        start: date,
        calendarMonth: date.getMonth(),
        calendarYear: date.getFullYear(),
        today: today(),
      };

      const spy = spyOn(gcService, 'getHolidaysYear').and.callFake(() =>
        of([]),
      );

      component.currentDate = newDate;
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith(date.getFullYear());
    });

    it('should get holidays with start year', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const spy = spyOn(gcService, 'getHolidaysYear').and.callFake(() =>
        of([]),
      );
      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith(today.getFullYear());
    });
  });

  describe('open', () => {
    it('should NOT open calendar', () => {
      component.open = false;
      expect(component.isOpen).toEqual(false);
    });

    it('should open calendar with today date', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      component.open = true;

      expect(component.isOpen).toEqual(true);
      expect(component.days).toHaveSize(42);
      expect(component.dates.calendarMonth).toEqual(today.getMonth());
      expect(component.dates.calendarYear).toEqual(today.getFullYear());
    });

    it('should open calendar with new date', () => {
      const date = new Date(2022, 4, 1, 0, 0, 0, 0);
      const newDate: IDates = {
        start: date,
        calendarMonth: date.getMonth(),
        calendarYear: date.getFullYear(),
        today: today(),
      };

      component.currentDate = newDate;
      component.open = true;

      expect(component.isOpen).toEqual(true);
      expect(component.days).toHaveSize(42);
      expect(component.dates.start).toEqual(date);
      expect(component.dates.calendarMonth).toEqual(date.getMonth());
      expect(component.dates.calendarYear).toEqual(date.getFullYear());
    });
  });

  describe('nextMonth', () => {
    it('should build calendar days of next month', () => {
      expect(component.dates.calendarMonth).toEqual(today().getMonth());
      expect(component.dates.calendarYear).toEqual(today().getFullYear());

      component.nextMonth();

      const nextMonthDate = new Date(
        today().getFullYear(),
        today().getMonth() + 1,
        1,
        0,
        0,
        0,
        0,
      );

      expect(component.dates.calendarMonth).toEqual(nextMonthDate.getMonth());
      expect(component.dates.calendarYear).toEqual(nextMonthDate.getFullYear());
    });

    it('should build calendar days of next month if is last month of the year', () => {
      const date = new Date(2022, 11, 1, 0, 0, 0, 0);
      const newDate: IDates = {
        start: date,
        calendarMonth: date.getMonth(),
        calendarYear: date.getFullYear(),
        today: today(),
      };
      component.currentDate = newDate;

      component.nextMonth();

      expect(component.dates.calendarMonth).toEqual(0);
      expect(component.dates.calendarYear).toEqual(2023);
    });
  });

  describe('previousMonth', () => {
    it('should build calendar days of previous month', () => {
      expect(component.dates.calendarMonth).toEqual(today().getMonth());
      expect(component.dates.calendarYear).toEqual(today().getFullYear());

      component.previousMonth();

      const nextMonthDate = new Date(
        today().getFullYear(),
        today().getMonth() - 1,
        1,
        0,
        0,
        0,
        0,
      );

      expect(component.dates.calendarMonth).toEqual(nextMonthDate.getMonth());
      expect(component.dates.calendarYear).toEqual(nextMonthDate.getFullYear());
    });

    it('should build calendar days of previous month if is last month of the year', () => {
      const date = new Date(2022, 0, 1, 0, 0, 0, 0);
      const newDate: IDates = {
        start: date,
        calendarMonth: date.getMonth(),
        calendarYear: date.getFullYear(),
        today: today(),
      };
      component.currentDate = newDate;

      component.previousMonth();

      expect(component.dates.calendarMonth).toEqual(11);
      expect(component.dates.calendarYear).toEqual(2021);
    });
  });

  describe('selectDateOnClick', () => {
    it('should select only start date', () => {
      const selectedDay = component.days[7];
      component.selectDateOnClick(selectedDay);

      const expectedDate = new Date(
        selectedDay.year,
        selectedDay.month,
        selectedDay.day,
        0,
        0,
        0,
        0,
      );

      expect(component.dates.start).toEqual(expectedDate);
      expect(component.days[7].class).toContain('current-date');
    });

    it('should select start date for date range', () => {
      const selectedDay = component.days[7];

      component.isDateRange = true;

      component.selectDateOnClick(selectedDay);

      const expectedDate = new Date(
        selectedDay.year,
        selectedDay.month,
        selectedDay.day,
        0,
        0,
        0,
        0,
      );

      expect(component.dates.start).toEqual(expectedDate);
      expect(component.days[7].class).toContain('current-date');
    });

    it('should select end date for date range', () => {
      const selectedStartDay = component.days[7];
      const selectedEndDay = component.days[9];

      component.isDateRange = true;

      component.selectDateOnClick(selectedStartDay);
      component.selectDateOnClick(selectedEndDay);

      const expectedStartDate = new Date(
        selectedStartDay.year,
        selectedStartDay.month,
        selectedStartDay.day,
        0,
        0,
        0,
        0,
      );

      const expectedEndDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      component.open = true;

      expect(component.dates.start).toEqual(expectedStartDate);
      expect(component.dates.end).toEqual(expectedEndDate);
      expect(component.days[7].class).toContain('current-date');
      expect(component.days[8].class).toContain('range-trace');
      expect(component.days[9].class).toContain('current-date');
    });

    it('should clear dates and select start date for date range', () => {
      const selectedStartDay = component.days[7];
      const selectedEndDay = component.days[9];

      component.isDateRange = true;

      component.selectDateOnClick(selectedStartDay);
      component.selectDateOnClick(selectedEndDay);

      const expectedStartDate = new Date(
        selectedStartDay.year,
        selectedStartDay.month,
        selectedStartDay.day,
        0,
        0,
        0,
        0,
      );

      const expectedEndDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      expect(component.dates.start).toEqual(expectedStartDate);
      expect(component.dates.end).toEqual(expectedEndDate);

      const newDate = component.days[10];

      component.selectDateOnClick(newDate);

      const expectedNewDate = new Date(
        newDate.year,
        newDate.month,
        newDate.day,
        0,
        0,
        0,
        0,
      );

      expect(component.dates.start).toEqual(expectedNewDate);
      expect(component.dates.end).toEqual(undefined);
      expect(component.days[7].class).not.toContain('current-date');
      expect(component.days[9].class).not.toContain('current-date');
      expect(component.days[10].class).toContain('current-date');
    });

    it('should reselect start date for date range if selected date is lower or equal previous start  date', () => {
      const selectedStartDay = component.days[9];
      const selectedEndDay = component.days[7];

      component.isDateRange = true;

      component.selectDateOnClick(selectedStartDay);
      component.selectDateOnClick(selectedEndDay);

      const expectedStartDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      const startDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      const currentDate: IDates = {
        start: startDate,
        calendarMonth: startDate.getMonth(),
        calendarYear: startDate.getFullYear(),
        today: today(),
      };
      component.currentDate = currentDate;

      expect(component.dates.start).toEqual(expectedStartDate);
      expect(component.dates.end).toEqual(undefined);
      expect(component.days[7].class).toContain('current-date');
      expect(component.days[9].class).not.toContain('current-date');
    });

    it('should select equal dates for start and end dates', () => {
      const selectedStartDay = component.days[7];
      const selectedEndDay = component.days[7];

      component.isDateRange = true;

      component.selectDateOnClick(selectedStartDay);
      component.selectDateOnClick(selectedEndDay);

      const expectedStartDate = new Date(
        selectedStartDay.year,
        selectedStartDay.month,
        selectedStartDay.day,
        0,
        0,
        0,
        0,
      );

      const expectedEndDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      component.open = true;

      expect(component.dates.start).toEqual(expectedStartDate);
      expect(component.dates.end).toEqual(expectedEndDate);
      expect(component.days[7].class).toContain('current-date');
    });

    it('should select equal dates for end and start dates', () => {
      const selectedStartDay = component.days[7];
      const selectedEndDay = component.days[7];

      component.isDateRange = true;

      const expectedEndDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      component.dates.end = expectedEndDate;

      component.selectDateOnClick(selectedStartDay);

      const expectedStartDate = new Date(
        selectedStartDay.year,
        selectedStartDay.month,
        selectedStartDay.day,
        0,
        0,
        0,
        0,
      );

      component.open = true;

      expect(component.dates.start).toEqual(expectedStartDate);
      expect(component.dates.end).toEqual(expectedEndDate);
      expect(component.days[7].class).toContain('current-date');
    });

    it('should select start date if end date is already selected and start date is lower', () => {
      const selectedStartDay = component.days[7];
      const selectedEndDay = component.days[9];

      component.isDateRange = true;

      const expectedEndDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      component.dates.end = expectedEndDate;

      component.selectDateOnClick(selectedStartDay);

      const expectedStartDate = new Date(
        selectedStartDay.year,
        selectedStartDay.month,
        selectedStartDay.day,
        0,
        0,
        0,
        0,
      );

      component.open = true;

      expect(component.dates.start).toEqual(expectedStartDate);
      expect(component.dates.end).toEqual(expectedEndDate);
      expect(component.days[7].class).toContain('current-date');
    });

    it('should set new end date if end date is already selected but the new date is higher', () => {
      const selectedEndDay = component.days[7];
      const selectedHigherEndDay = component.days[9];

      component.isDateRange = true;

      const expectedEndDate = new Date(
        selectedEndDay.year,
        selectedEndDay.month,
        selectedEndDay.day,
        0,
        0,
        0,
        0,
      );

      component.dates.end = expectedEndDate;

      component.selectDateOnClick(selectedHigherEndDay);

      const expectedHigherEndDate = new Date(
        selectedHigherEndDay.year,
        selectedHigherEndDay.month,
        selectedHigherEndDay.day,
        0,
        0,
        0,
        0,
      );

      component.open = true;

      expect(component.dates.start).toEqual(undefined);
      expect(component.dates.end).toEqual(expectedHigherEndDate);
      expect(component.days[9].class).toContain('current-date');
    });

    it('should select date with hours when isDateTime flag true', () => {
      const selectedDay = component.days[7];
      const mockTime = {
        hour: 10,
        minute: 40,
      };
      const expectedDate = new Date(
        selectedDay.year,
        selectedDay.month,
        selectedDay.day,
        mockTime.hour,
        mockTime.minute,
        0,
        0,
      );

      component.time = mockTime;
      component.isDateTime = true;
      component.selectDateOnClick(selectedDay);

      expect(component.dates.start).toEqual(expectedDate);
    });
  });

  describe('selectTimeOnClick', () => {
    it('should update selected hour of date', () => {
      const selectedDay = component.days[7];
      const mockTimeEvent: ITimeChangeEvent = {
        type: 'hour',
        value: 20,
      };
      const expectedDate = new Date(
        selectedDay.year,
        selectedDay.month,
        selectedDay.day,
        mockTimeEvent.value,
        0,
        0,
        0,
      );

      component.selectDateOnClick(selectedDay);
      component.selectTimeOnClick(mockTimeEvent);

      expect(component.dates.start?.getHours()).toEqual(
        expectedDate.getHours(),
      );
    });

    it('should update selected minute of date', () => {
      const selectedDay = component.days[7];
      const mockTimeEvent: ITimeChangeEvent = {
        type: 'minute',
        value: 50,
      };
      const expectedDate = new Date(
        selectedDay.year,
        selectedDay.month,
        selectedDay.day,
        0,
        mockTimeEvent.value,
        0,
        0,
      );

      component.selectDateOnClick(selectedDay);
      component.selectTimeOnClick(mockTimeEvent);

      expect(component.dates.start?.getMinutes()).toEqual(
        expectedDate.getMinutes(),
      );
    });

    it('should initialize a new date based on current day if there no date already selected', () => {
      const mockTimeEvent: ITimeChangeEvent = {
        type: 'hour',
        value: 10,
      };
      const expectedDate = new Date(component.dates.today);
      expectedDate.setHours(mockTimeEvent.value);

      component.selectTimeOnClick(mockTimeEvent);

      expect(component.dates.start).toEqual(expectedDate);
    });
  });

  describe('setRangeTraceStyle and removeRangeTraceStyle', () => {
    it('should NOT setRangeTraceStyle if component is NOT date range', () => {
      const selectedDay = component.days[7];
      component.selectDateOnClick(selectedDay);

      const selectedDayNextIndex = 8;
      component.setRangeTraceStyle(selectedDayNextIndex);

      expect(component.days[8].class).not.toContain('range-hover');
    });

    it('should NOT setRangeTraceStyle date range is setted', () => {
      const selectedStartDay = component.days[7];
      const selectedEndDay = component.days[9];
      component.isDateRange = true;
      component.selectDateOnClick(selectedStartDay);
      component.selectDateOnClick(selectedEndDay);

      const selectedDayNextIndex = 8;
      component.setRangeTraceStyle(selectedDayNextIndex);

      expect(component.days[8].class).not.toContain('range-hover');

      const selectedDayNextIndex2 = 10;
      component.setRangeTraceStyle(selectedDayNextIndex2);
      expect(component.days[10].class).not.toContain('range-hover');
    });

    it('should setRangeTraceStyle when start date is selected and component is date range', () => {
      const selectedDay = component.days[7];
      component.isDateRange = true;
      component.selectDateOnClick(selectedDay);

      const selectedDayNextIndex = 8;
      component.setRangeTraceStyle(selectedDayNextIndex);

      expect(component.days[8].class).toContain('range-hover');
    });

    it('should removeRangeTraceStyle', () => {
      const selectedDay = component.days[7];
      component.isDateRange = true;
      component.selectDateOnClick(selectedDay);

      const selectedDayNextIndex = 8;
      component.setRangeTraceStyle(selectedDayNextIndex);

      expect(component.days[8].class).toContain('range-hover');

      component.removeRangeTraceStyle();

      expect(component.days[8].class).not.toContain('range-hover');
    });

    it('should setRangeTraceStyle when start date is selected, component is date range and is in next month', () => {
      const selectedDay = component.days[7];
      component.isDateRange = true;
      component.selectDateOnClick(selectedDay);

      const selectedDayNextIndex = 8;
      component.setRangeTraceStyle(selectedDayNextIndex);

      expect(component.days[8].class).toContain('range-hover');

      component.nextMonth();

      component.setRangeTraceStyle(selectedDayNextIndex);
      expect(component.days[8].class).toContain('range-hover');
    });

    it('should setRangeTraceStyle when start date is selected, component is date range and is in next year', () => {
      const selectedDay = component.days[7];
      component.isDateRange = true;
      component.selectDateOnClick(selectedDay);

      const selectedDayNextIndex = 8;
      component.setRangeTraceStyle(selectedDayNextIndex);

      expect(component.days[8].class).toContain('range-hover');

      for (let i = component.dates.calendarMonth; i <= 12; i++) {
        component.nextMonth();
      }

      component.setRangeTraceStyle(selectedDayNextIndex);
      expect(component.days[8].class).toContain('range-hover');
    });
  });

  describe('handleShortcut', () => {
    it('should set start date to the end date minus the daysBack', () => {
      const spyClose = spyOn(component, 'closeCalendar');
      const spyEmit = spyOn(component.emitSelectDate, 'emit');
      component.dates = new Dates();
      component.dates.start = new Date('2020-01-10');
      component.dates.end = new Date('2020-01-10');

      component.handleShortcut(2);
      expect(component.dates.start).toEqual(new Date('2020-01-08'));
      expect(component.dates.end).toEqual(new Date('2020-01-10'));
      expect(spyClose).toHaveBeenCalled();
      expect(spyEmit).toHaveBeenCalledWith(component.dates);
    });

    it('should set dates when start date is already defined', () => {
      const spyClose = spyOn(component, 'closeCalendar');
      const spyEmit = spyOn(component.emitSelectDate, 'emit');
      component.dates = new Dates();
      component.dates.start = new Date('2020-01-10');

      component.handleShortcut(2);
      expect(component.dates.start).toEqual(new Date('2020-01-08'));
      expect(component.dates.end).toEqual(new Date('2020-01-10'));
      expect(spyClose).toHaveBeenCalled();
      expect(spyEmit).toHaveBeenCalledWith(component.dates);
    });

    it('should set start and end date to the today if start and end are null', () => {
      const spyClose = spyOn(component, 'closeCalendar');
      const spyEmit = spyOn(component.emitSelectDate, 'emit');
      component.dates = new Dates();
      component.dates.today = new Date('2020-01-10');

      component.handleShortcut(2);
      expect(component.dates.start).toEqual(new Date('2020-01-08'));
      expect(component.dates.end).toEqual(new Date('2020-01-10'));
      expect(spyClose).toHaveBeenCalled();
      expect(spyEmit).toHaveBeenCalledWith(component.dates);
    });
  });

  describe('years', () => {
    it('should build years with today date', () => {
      const dates = new Dates();
      component.currentDate = dates;
      expect(component.years).toHaveSize(24);
    });

    it('should toggle year view', () => {
      component.toggleIsYearView();
      expect(component.isYearView).toBeTrue();
    });

    it('should change year view', () => {
      const dates = new Dates();
      dates.start = new Date();
      dates.end = new Date();
      component.currentDate = dates;
      component.nextYearView();
      component.previousYearView();
      expect(component.years).toHaveSize(24);
    });

    it('should set year', () => {
      const spy = spyOn(component.emitSelectDate, 'emit');
      const dates = new Dates();
      dates.start = new Date();
      const nextYear = dates.start.getFullYear() + 1;

      component.currentDate = dates;
      component.isDateRange = false;
      component.disablePastDates = false;
      component.setYear(nextYear);

      expect(spy).toHaveBeenCalled();
      expect(component.dates.start?.getFullYear()).toEqual(nextYear);
    });

    it('should not set year if it is a date range', () => {
      const spy = spyOn(component.emitSelectDate, 'emit');
      const dates = new Dates();
      dates.start = new Date();
      const currentYear = dates.start.getFullYear();
      const nextYear = currentYear + 1;

      component.currentDate = dates;
      component.isDateRange = true;
      component.disablePastDates = false;
      component.setYear(nextYear);

      expect(spy).not.toHaveBeenCalled();
      expect(component.dates.start?.getFullYear()).toEqual(currentYear);
    });

    it('should not set year if date start is empty', () => {
      const spy = spyOn(component.emitSelectDate, 'emit');

      component.currentDate = new Dates();
      component.isDateRange = false;
      component.disablePastDates = false;
      component.setYear(2100);

      expect(spy).not.toHaveBeenCalled();
      expect(component.dates.start).toBeUndefined();
    });

    it('should not set year if disablepastdates is true and start date is before today', () => {
      const spy = spyOn(component.emitSelectDate, 'emit');
      const dates = new Dates();
      dates.start = new Date();
      const previousYear = dates.start.getFullYear() - 1;

      component.currentDate = dates;
      component.isDateRange = false;
      component.disablePastDates = true;
      component.setYear(previousYear);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('disablePastDates', () => {
    it('should disable past dates and shortcuts', () => {
      component.disablePastDates = true;
      component.ngOnInit();

      expect(component.shortcuts[0].class.includes('disabled')).toBeTrue();
    });
  });

  describe('setMonth', () => {
    it('should setMonth', () => {
      const spy = spyOn(component, 'selectDateOnClick');
      component.setMonth(1);

      expect(spy).toHaveBeenCalledWith({
        day: 1,
        month: 1,
        year: component.dates.calendarYear,
        class: '',
        index: 0,
      });
    });
  });
});
