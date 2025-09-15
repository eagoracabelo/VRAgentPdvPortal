import { DatePipe } from '@angular/common';

import { IDates } from '../interfaces/dates.interface';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export class Dates implements IDates {
  today = new Date();
  calendarMonth = this.today.getMonth();
  calendarYear = this.today.getFullYear();
  start?: Date;
  end?: Date;

  private readonly _datePipe = new DatePipe('pt-BR');

  constructor(dates?: IDates) {
    if (dates) {
      Object.assign(this, dates);
    }

    this.today.setHours(0, 0, 0, 0);
  }

  get startYear(): number {
    return this.start?.getFullYear() ?? -1;
  }

  get startMonth(): number {
    return this.start?.getMonth() ?? -1;
  }

  get endYear(): number {
    return this.end?.getFullYear() ?? -1;
  }

  get endMonth(): number {
    return this.end?.getMonth() ?? -1;
  }

  get todayYear(): number {
    return this.today.getFullYear();
  }

  get todayMonth(): number {
    return this.today.getMonth();
  }

  get monthName(): string {
    return months[this.calendarMonth] ?? 'Mês indefinido';
  }

  isRangeFilled(): boolean {
    return !!this.start && !!this.end;
  }

  resetRange(): void {
    this.start = undefined;
    this.end = undefined;
  }

  toLastYear(month: number): void {
    if (this.isLastYear(month)) {
      this.calendarYear--;
    }
  }

  toNextYear(month: number): void {
    if (this.isNextYear(month)) {
      this.calendarYear++;
    }
  }

  transform(date: Date, mask = 'dd/MM/yyyy'): string {
    return this._datePipe.transform(date, mask) as string;
  }

  private isNextYear(month: number): boolean {
    return this.calendarMonth === 11 && month === 0;
  }

  private isLastYear(month: number): boolean {
    return this.calendarMonth === 0 && month === 11;
  }
}
