import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { ICalendar } from '../interfaces/calendar.interface';
import { IDates } from '../interfaces/dates.interface';
import { ITimeChangeEvent } from '../interfaces/time-change.interface';
import { Dates } from '../models/dates';
import { ECalendarPosition } from '../models/vr-calendar-position';
import { Holiday } from './../models/holiday';
import { GoogleCalendarHolidayService } from './../service/google-calendar-holiday.service';

interface ICalendarEvents {
  day: number;
  event: string;
  type: string;
}

@Component({
  selector: 'vrc-calendar',
  templateUrl: './vrc-calendar.component.html',
  styleUrls: ['./vrc-calendar.component.scss'],
  providers: [DatePipe],
})
export class VrcCalendarComponent implements OnInit {
  @ViewChild('calendarContainer') calendarContainerRef!: ElementRef;
  @ViewChild('calendar') calendarRef!: ElementRef;

  @Input() isMonthSelection = false;
  @Input() useNonWorkingDays = false;
  @Input() datepicker!: HTMLDivElement;
  @Input() isDateRange!: boolean;
  @Input() isDateTime!: boolean;
  @Input() showShortcuts!: boolean;
  @Input() calendarPosition!: ECalendarPosition;
  @Input() disablePastDates = false;

  @Output() emitSelectDate: EventEmitter<Dates> = new EventEmitter<Dates>();
  @Output() emitCloseCalendar = new EventEmitter();

  dates: Dates = new Dates();
  days: ICalendar[] = [];
  time = {
    hour: 0,
    minute: 0,
  };
  isOpen = false;

  events: ICalendarEvents[] = [];

  shortcuts = [
    { class: '', daysBack: 7 },
    { class: '', daysBack: 15 },
    { class: '', daysBack: 30 },
    { class: '', daysBack: 60 },
    { class: '', daysBack: 90 },
  ];

  isYearView = false;
  years: number[] = [];
  months: { label: string; value: number; classes: string }[] = [];

  private holidays: Holiday[] = [];

  constructor(private readonly _gcHolidaySevice: GoogleCalendarHolidayService) {
    this.closeOnKeydownEscape();
  }

  @Input() set open(isOpen: boolean) {
    if (this.calendarRef && isOpen) {
      const holidays = this.getCurrentHolidays();
      this.buildEvents(holidays);
      this.isOpen = isOpen;
      this.buildCalendar();
    }
  }

  @Input() set currentDate(dates: IDates) {
    this.dates = new Dates(dates);

    this.buildCalendar();
    this.buildYears();
    this.buildMonths();
  }

  get calendarElement(): HTMLElement {
    return this.calendarRef.nativeElement as HTMLElement;
  }

  get calendarContainerElement(): HTMLElement {
    return this.calendarContainerRef.nativeElement as HTMLElement;
  }

  ngOnInit(): void {
    this.getHolidays(
      this.dates.startYear === -1 ? this.dates.todayYear : this.dates.startYear,
    );
    const holidays = this.getCurrentHolidays();
    this.buildEvents(holidays);

    this.buildCalendar();
  }

  private buildMonths(): void {
    this.months = [];

    const dates = new Dates(this.dates);
    dates.calendarMonth = 0;
    for (dates.calendarMonth; dates.calendarMonth < 12; dates.calendarMonth++) {
      let classes = '';

      if (this.dates.startMonth === dates.calendarMonth) {
        classes += ' selected-month';
      }

      if (this.dates.todayMonth === dates.calendarMonth) {
        classes += ' today-month';
      }

      this.months.push({
        label: dates.monthName,
        value: dates.calendarMonth,
        classes,
      });
    }
  }

  setMonth(month: number): void {
    this.selectDateOnClick({
      day: 1,
      month,
      year: this.dates.calendarYear,
      class: '',
      index: 0,
    });
  }

  private buildYears(): void {
    const selectedDate = this.dates.start || this.dates.today;
    const selectedYear = Number(selectedDate.getFullYear());
    this.years = [];
    for (let index = selectedYear - 12; index < selectedYear + 12; index++) {
      this.years.push(index);
    }
  }

  toggleIsYearView(): void {
    this.isYearView = !this.isYearView;
  }

  nextYearView(): void {
    this.years = this.years.map((item) => item + 24);
  }

  previousYearView(): void {
    this.years = this.years.map((item) => item - 24);
  }

  setYear(year: number): void {
    this.dates.calendarYear = year;
    this.days = this.createCalendar(this.dates.calendarMonth, year);
    this.updateHolidaysOnYearChange(year);
    this.toggleIsYearView();

    if (this.isDateRange || !this.dates.start) return;

    const previewStartDate = new Date(this.dates.start);
    previewStartDate.setFullYear(year);

    if (this.disablePastDates && previewStartDate < this.dates.today) return;

    this.dates.start.setFullYear(year);
    this.emitSelectDate.emit(this.dates);
  }

  private updateHolidaysOnYearChange(year: number): void {
    this._gcHolidaySevice.getHolidaysYear(year).subscribe((holidayValues) => {
      this.holidays = holidayValues;
      const holidays = this.getCurrentHolidays();
      this.buildEvents(holidays);
    });
  }

  nextMonth(): void {
    this.dates.calendarMonth++;

    if (this.dates.calendarMonth > 11) {
      this.dates.calendarYear++;
      this.dates.calendarMonth = 0;
      this.events = [];
      this.getHolidays(this.dates.calendarYear);
    }
    const holidays = this.getCurrentHolidays();
    this.buildEvents(holidays);

    this.days = this.createCalendar(
      this.dates.calendarMonth,
      this.dates.calendarYear,
    );
  }

  previousMonth(): void {
    this.dates.calendarMonth--;

    if (this.dates.calendarMonth < 0) {
      this.dates.calendarYear--;
      this.dates.calendarMonth = 11;
      this.events = [];
      this.getHolidays(this.dates.calendarYear);
    }
    const holidays = this.getCurrentHolidays();
    this.buildEvents(holidays);

    this.days = this.createCalendar(
      this.dates.calendarMonth,
      this.dates.calendarYear,
    );
  }

  handleShortcut(daysBack: number): void {
    if (this.dates.start && this.dates.end) {
      this.dates.start = new Date(this.dates.end);
    } else {
      this.dates.end = new Date(this.dates.start || this.dates.today);
      this.dates.start = new Date(this.dates.end);
    }
    this.dates.start.setDate(this.dates.end.getDate() - daysBack);
    this.closeCalendar();
    this.emitSelectDate.emit(this.dates);
  }

  selectDateOnClick(day: ICalendar): void {
    this.dates.toNextYear(day.month);
    this.dates.toLastYear(day.month);
    const date = new Date(day.year, day.month, day.day);
    date.setHours(0, 0, 0, 0);

    if (this.isDateRange) {
      if (this.dates.isRangeFilled()) {
        this.dates.resetRange();
        this.days = this.createCalendar(
          this.dates.calendarMonth,
          this.dates.calendarYear,
        );
      }

      this.validateSamePeriod(date);
      this.validateForDateStart(date);
      this.validateForDateEnd(date);

      if (this.dates.start && this.dates.end) {
        this.closeCalendar();
      }
    } else if (this.isDateTime) {
      date.setHours(this.time.hour, this.time.minute, 0, 0);
      this.dates.start = date;
    } else {
      this.dates.start = date;
      this.closeCalendar();
    }

    this.days[day.index].class = this.getClasses(date);

    this.emitSelectDate.emit(this.dates);
  }

  selectTimeOnClick({ type, value }: ITimeChangeEvent): void {
    this.time[type] = value;
    this.dates.start = this.dates.start
      ? this.dates.start
      : new Date(this.dates.today);

    this.dates.start.setHours(this.time.hour, this.time.minute, 0, 0);
    this.emitSelectDate.emit(this.dates);
  }

  closeCalendar(): void {
    this.dates.calendarMonth =
      this.dates.startMonth === -1
        ? this.dates.todayMonth
        : this.dates.startMonth;
    this.dates.calendarYear =
      this.dates.startYear === -1 ? this.dates.todayYear : this.dates.startYear;
    this.isOpen = false;
    this.isYearView = false;
    this.emitCloseCalendar.emit();
  }

  removeRangeTraceStyle(): void {
    for (const day of this.days) {
      if (day.class.includes('range-hover')) {
        day.class = day.class?.replace(/range-hover/g, '');
      }
    }
  }

  setRangeTraceStyle(index: number): void {
    if (this.isDateRange) {
      const startDay = this.days.find((d) => d.class.includes('current-date'));

      this.removeRangeTraceStyle();

      if (!!startDay && !this.dates.end) {
        for (let i = startDay.index + 1; i <= index; i++) {
          this.days[i].class += ' range-hover';
        }
      } else {
        if (this.isRangeHover()) {
          for (let i = 0; i <= index; i++) {
            this.days[i].class += ' range-hover';
          }
        }
      }
    }
  }

  private initCalendar(currentDate: Date): void {
    const date = new Date(currentDate);
    this.days = this.createCalendar(date.getMonth(), date.getFullYear());
  }

  private isRangeHover(): boolean {
    return (
      !!this.dates.start &&
      !this.dates.end &&
      ((this.dates.startYear === this.dates.calendarYear &&
        this.dates.startMonth < this.dates.calendarMonth) ||
        this.dates.startYear < this.dates.calendarYear)
    );
  }

  private fillEvents(
    events: ICalendarEvents[],
    currentEvents: ICalendarEvents[],
  ): ICalendarEvents[] {
    events.forEach((e) => {
      const hasNoEvent = currentEvents.every(
        (current) => current.day !== e.day,
      );
      if (hasNoEvent) {
        const currentEvent = {
          day: e.day,
          event: e.event,
          type: e.type,
        };

        currentEvents.push(currentEvent);
      } else {
        currentEvents
          .filter((current) => current.day === e.day)
          .forEach((current) => {
            current.type = e.type;
          });
      }
    });

    return currentEvents;
  }

  private readonly orderByEvents = (
    a: { day: number; event: string; type: string },
    b: { day: number; event: string; type: string },
  ): number => {
    if (a.day > b.day) {
      return 1;
    }
    if (a.day < b.day) {
      return -1;
    }
    return 0;
  };

  private closeOnKeydownEscape(): void {
    document.body.addEventListener('keydown', (keydownEvent: KeyboardEvent) => {
      if (keydownEvent.code === 'Escape') {
        this.closeCalendar();
      }
    });
  }

  private buildCalendar(): void {
    if (this.dates.start) {
      this.dates.calendarMonth = this.dates.startMonth;
      this.dates.calendarYear = this.dates.startYear;
      this.time = {
        hour: this.dates.start.getHours(),
        minute: this.dates.start.getMinutes(),
      };
      this.initCalendar(this.dates.start);
    } else {
      this.initCalendar(this.dates.today);
    }
  }

  private getHolidays(year: string | number): void {
    this._gcHolidaySevice.getHolidaysYear(year).subscribe((holidayValues) => {
      this.holidays = holidayValues;
    });
  }

  private createCalendar(month: number, year: number): ICalendar[] {
    const calendarSize = 42;
    const calendar: ICalendar[] = [];
    const addDate = (
      d: number,
      m: number,
      y: number,
      c: string,
      i: number,
    ): number =>
      calendar.push({
        day: d,
        month: m,
        year: y,
        class: c,
        index: i,
      });

    const currentDate = new Date(Date.UTC(year, month, 1));
    const nextDate = new Date(Date.UTC(year, month + 1, 1));
    const previousDate = new Date(Date.UTC(year, month, 1));
    currentDate.setHours(0, 0, 0, 0);
    nextDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);

    previousDate.setUTCDate(previousDate.getUTCDate() + 1);
    for (let day = previousDate.getDay(); day > 0; day--) {
      addDate(
        previousDate.getDate(),
        previousDate.getMonth(),
        previousDate.getFullYear(),
        'not-visible',
        calendar.length,
      );
      previousDate.setUTCDate(previousDate.getUTCDate() - 1);
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    while (
      currentDate.getUTCMonth() === month &&
      calendar.length < calendarSize
    ) {
      const classes = this.getClasses(currentDate);
      addDate(
        currentDate.getDate(),
        currentDate.getMonth(),
        currentDate.getFullYear(),
        classes,
        calendar.length,
      );
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    while (calendar.length < calendarSize) {
      addDate(
        nextDate.getDate(),
        nextDate.getMonth(),
        nextDate.getFullYear(),
        'not-visible',
        calendar.length,
      );
      nextDate.setUTCDate(nextDate.getUTCDate() + 1);
    }

    this.handleShortcutsClasses();

    return calendar;
  }

  private handleShortcutsClasses(): void {
    this.shortcuts.forEach((shorcut) => {
      shorcut.class = this.disableShortcut(shorcut.daysBack) ? 'disabled' : '';
    });
  }

  private disableShortcut(daysBack: number): boolean {
    if (!this.disablePastDates) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(this.dates.end || this.dates.start || today);
    selectedDate.setHours(0, 0, 0, 0);
    selectedDate.setDate(selectedDate.getDate() - daysBack);

    return selectedDate < today;
  }

  private getClasses(date: Date): string {
    let classStyle = '';

    if (this.isCurrentStartDate(date)) {
      classStyle += 'current-date start-date ';
    }

    if (this.isCurrentEndDate(date)) {
      classStyle += 'current-date end-date ';
    }

    if (this.isCurrentRangeDate(date)) {
      classStyle += 'range-trace';
    }

    if (this.isToday(date)) {
      classStyle += 'today ';
    }

    if (this.shouldDisableCurrentDate(date)) {
      classStyle += ' disabled';
    }

    return classStyle;
  }

  private isCurrentStartDate(date: Date): boolean {
    return (
      !!this.dates.start &&
      date.getUTCMonth() === this.dates.start.getUTCMonth() &&
      date.getFullYear() === this.dates.start.getFullYear() &&
      date.getDate() === this.dates.start.getDate()
    );
  }

  private isCurrentEndDate(date: Date): boolean {
    return (
      !!this.dates.end &&
      date.getUTCMonth() === this.dates.end.getUTCMonth() &&
      date.getFullYear() === this.dates.end.getFullYear() &&
      date.getDate() === this.dates.end.getDate()
    );
  }

  private isCurrentRangeDate(date: Date): boolean {
    if (!this.dates.start || !this.dates.end) return false;

    const cloneStartDate = new Date(this.dates.start);
    cloneStartDate.setHours(0, 0, 0, 0);

    const cloneEndDate = new Date(this.dates.end);
    cloneEndDate.setHours(0, 0, 0, 0);

    const cloneCurrentDate = new Date(date);
    cloneCurrentDate.setHours(0, 0, 0, 0);

    return cloneCurrentDate > cloneStartDate && cloneCurrentDate < cloneEndDate;
  }

  private shouldDisableCurrentDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cloneCurrentDate = new Date(date);
    cloneCurrentDate.setHours(0, 0, 0, 0);

    return this.disablePastDates && cloneCurrentDate < today;
  }

  private buildEvents(calendarEvents: ICalendarEvents[]): void {
    this.events = this.fillEvents(calendarEvents, []).sort(this.orderByEvents);
  }

  private validateSamePeriod(date: Date): void {
    if (
      this.dates.start &&
      !this.dates.end &&
      date.toISOString() === this.dates.start.toISOString()
    ) {
      this.dates.end = new Date(date);
    }

    if (
      !this.dates.start &&
      this.dates.end &&
      date.toISOString() === this.dates.end.toISOString()
    ) {
      this.dates.start = new Date(date);
    }
  }

  private validateForDateStart(date: Date): void {
    if (!this.dates.start && !this.dates.end) {
      this.dates.start = new Date(date);
    }

    if (!this.dates.start && this.dates.end) {
      if (date < this.dates.end) {
        this.dates.start = new Date(date);
      }
    }

    if (this.dates.start && date <= this.dates.start) {
      this.dates.start = new Date(date);
    }
  }

  private validateForDateEnd(date: Date): void {
    if (this.dates.start && date > this.dates.start) {
      this.dates.end = new Date(date);
    }

    if (!this.dates.start && this.dates.end && date > this.dates.end) {
      this.dates.end = new Date(date);
    }
  }

  private getCurrentHolidays(): ICalendarEvents[] {
    const holidays = this.filterCurrentHolidays();
    return holidays.map((h) => ({
      day: parseInt(h.start.date.split('-')[2], 10),
      event: h.summary ?? '',
      type: 'holiday',
    }));
  }

  private filterCurrentHolidays(): Holiday[] {
    return this.holidays.filter(
      (h) => +h.start.date.split('-')[1] - 1 === this.dates.calendarMonth,
    );
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    const sourceDate = `${date.getDate()}/${date.getUTCMonth()}/${date.getFullYear()}`;
    const targetDate = `${today.getDate()}/${today.getUTCMonth()}/${today.getFullYear()}`;
    return sourceDate === targetDate;
  }
}
