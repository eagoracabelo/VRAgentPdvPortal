import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { IDates } from '../interfaces/dates.interface';
import { Dates } from './dates';

registerLocaleData(localePt, 'pt-BR');

describe(`${Dates.name}`, () => {
  let dates!: Dates;

  beforeEach(() => {
    dates = new Dates({
      calendarMonth: 0,
      calendarYear: 2022,
      today: new Date(),
    } as IDates);
  });

  it('should be defined', () => {
    expect(dates).toBeDefined();
  });

  it('should create new instance of Dates with default values', () => {
    const newDates = new Dates();
    const today = new Date();
    expect(newDates).toBeDefined();
    expect(newDates.today.getDate()).toEqual(today.getDate());
    expect(newDates.today.getMonth()).toEqual(today.getMonth());
    expect(newDates.today.getFullYear()).toEqual(today.getFullYear());
    expect(newDates.calendarMonth).toEqual(newDates.todayMonth);
    expect(newDates.calendarYear).toEqual(newDates.todayYear);
  });

  describe('getters', () => {
    it('should return -1 if start date is not setted', () => {
      expect(dates.start).toBeFalsy();
      expect(dates.startMonth).toEqual(-1);
      expect(dates.startYear).toEqual(-1);
    });

    it('should set start date and get year and month', () => {
      dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);
      expect(dates.startMonth).toEqual(4);
      expect(dates.startYear).toEqual(2022);
    });

    it('should return -1 if end date is not setted', () => {
      expect(dates.end).toBeFalsy();
      expect(dates.endMonth).toEqual(-1);
      expect(dates.endYear).toEqual(-1);
    });

    it('should set end date and get year and month', () => {
      dates.end = new Date(2022, 4, 5, 0, 0, 0, 0);
      expect(dates.endMonth).toEqual(4);
      expect(dates.endYear).toEqual(2022);
    });

    it('should get month name', () => {
      dates.calendarMonth = 0;
      expect(dates.monthName).toEqual('Janeiro');

      dates.calendarMonth = 1;
      expect(dates.monthName).toEqual('Fevereiro');

      dates.calendarMonth = 2;
      expect(dates.monthName).toEqual('Março');

      dates.calendarMonth = 3;
      expect(dates.monthName).toEqual('Abril');

      dates.calendarMonth = 4;
      expect(dates.monthName).toEqual('Maio');

      dates.calendarMonth = 5;
      expect(dates.monthName).toEqual('Junho');

      dates.calendarMonth = 6;
      expect(dates.monthName).toEqual('Julho');

      dates.calendarMonth = 7;
      expect(dates.monthName).toEqual('Agosto');

      dates.calendarMonth = 8;
      expect(dates.monthName).toEqual('Setembro');

      dates.calendarMonth = 9;
      expect(dates.monthName).toEqual('Outubro');

      dates.calendarMonth = 10;
      expect(dates.monthName).toEqual('Novembro');

      dates.calendarMonth = 11;
      expect(dates.monthName).toEqual('Dezembro');
    });

    it('should return "Mês indefinido" if month index is invalid', () => {
      dates.calendarMonth = 13;
      expect(dates.monthName).toEqual('Mês indefinido');
    });
  });

  it('should return true if start date and end date are setted', () => {
    dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);
    dates.end = new Date(2022, 4, 5, 0, 0, 0, 0);
    expect(dates.isRangeFilled()).toEqual(true);
  });

  it('should return false if just start date is setted', () => {
    dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);
    expect(dates.isRangeFilled()).toEqual(false);
  });

  it('should return false if just end date is setted', () => {
    dates.end = new Date(2022, 4, 5, 0, 0, 0, 0);
    expect(dates.isRangeFilled()).toEqual(false);
  });

  it('should set start and end dates to undefined', () => {
    dates.start = new Date(2022, 4, 1, 0, 0, 0, 0);
    dates.end = new Date(2022, 4, 5, 0, 0, 0, 0);
    expect(dates.isRangeFilled()).toEqual(true);

    dates.resetRange();

    expect(dates.start).toBeFalsy();
    expect(dates.end).toBeFalsy();
  });

  it('should increment year when last month is reached', () => {
    dates.calendarYear = 2022;
    dates.calendarMonth = 11;

    dates.toNextYear(0);

    expect(dates.calendarYear).toEqual(2023);
  });

  it('should NOT increment year when last month is NOT reached', () => {
    dates.calendarYear = 2022;
    dates.calendarMonth = 11;

    dates.toNextYear(5);

    expect(dates.calendarYear).toEqual(2022);
  });

  it('should decrement year when first month is reached', () => {
    dates.calendarYear = 2022;
    dates.calendarMonth = 0;

    dates.toLastYear(11);

    expect(dates.calendarYear).toEqual(2021);
  });

  it('should NOT decrement year when first month is NOT reached', () => {
    dates.calendarYear = 2022;
    dates.calendarMonth = 5;

    dates.toLastYear(11);

    expect(dates.calendarYear).toEqual(2022);
  });

  it('should format date to dd/MM/yyyy pattern', () => {
    expect(dates.transform(new Date(2022, 4, 1, 0, 0, 0, 0))).toEqual(
      '01/05/2022',
    );
  });
});
