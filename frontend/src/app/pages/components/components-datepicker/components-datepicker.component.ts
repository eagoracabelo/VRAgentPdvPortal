import { AfterContentInit, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  Dates,
  ECalendarPosition,
  VrcCalendarEventsService,
} from '@vrsoftbr/vr-components';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-datepicker',
  templateUrl: './components-datepicker.component.html',
  styleUrls: ['./components-datepicker.component.scss'],
})
export class ComponentsDatepickerComponent
  extends MarkdownCommon
  implements OnInit, AfterContentInit
{
  formGroup!: FormGroup;
  formGroupRange!: FormGroup;
  formGroupDateTime!: FormGroup;
  formGroupMonth!: FormGroup;
  data = new Date();

  monthValue = new Dates();
  monthValueText = '';
  monthValueTextForm = '';
  monthValueTextFormRequired = '';

  private _rangeValue = new Dates();
  private _rangeValueText = '';

  get rangeValue(): Dates {
    return this._rangeValue;
  }

  get rangeValueText(): string {
    return this._rangeValueText;
  }

  set rangeValueText(v: string) {
    this._rangeValueText = v;
  }

  set rangeValue(dates: Dates) {
    this._rangeValue = dates;
  }

  get formattedRangeValue(): string {
    const start = this._rangeValue.start
      ? this._rangeValue.start.toString()
      : '';
    const end = this._rangeValue.end ? this._rangeValue.end.toString() : '';
    return `${start} - ${end}`;
  }

  rangeValueTextForm = '';

  private _rangeValueAtalhos = new Dates();
  private _rangeValueTextAtalhos = '';

  get rangeValueAtalhos(): Dates {
    return this._rangeValueAtalhos;
  }

  get rangeValueTextAtalhos(): string {
    return this._rangeValueTextAtalhos;
  }

  set rangeValueTextAtalhos(v: string) {
    this._rangeValueTextAtalhos = v;
  }

  set rangeValueAtalhos(dates: Dates) {
    this._rangeValueAtalhos = dates;
  }

  get formattedRangeValueAtalhos(): string {
    const start = this._rangeValueAtalhos.start
      ? this._rangeValueAtalhos.start.toString()
      : '';
    const end = this._rangeValueAtalhos.end
      ? this._rangeValueAtalhos.end.toString()
      : '';
    return `${start} - ${end}`;
  }

  rangeValueTextFormAtalhos = '';

  constructor(
    private service: VrcCalendarEventsService,
    private formBuilder: FormBuilder,
  ) {
    super();
  }

  set value(v: string) {
    this.formGroup.get('text')?.setValue(v);
  }

  set dateTimeValue(v: string) {
    this.formGroupDateTime.get('text')?.setValue(v);
  }

  ngOnInit(): void {
    this.service.url = `https://api.calendario.com.br/?json=true&estado=SP&cidade=SAO%20PAULO&token=bWF0aGV1cy5wYWR1YUB2cnNvZnQuY29tLmJyJmhhc2g9MjAzOTY4NTM3`;
    this.buildForm();
  }

  ngAfterContentInit(): void {
    const dates = new Dates();
    dates.start = new Date('December 25, 2023 03:24:00');
    this.formGroup.get('date')?.setValue(dates);
    this.formGroupDateTime.get('date')?.setValue(dates);
  }

  getField(field: string): AbstractControl | null {
    return this.formGroup.get(field);
  }

  getDateTimeField(field: string): AbstractControl | null {
    return this.formGroupDateTime.get(field);
  }

  getDateRange(): string {
    const dateRangeValue = this.formGroupRange.get('dateRange')?.value as Dates;

    if (dateRangeValue) {
      const start = dateRangeValue.start ? dateRangeValue.start.toString() : '';
      const end = dateRangeValue.end ? dateRangeValue.end.toString() : '';
      return `${start} - ${end}`;
    }

    return '';
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      text: [null],
      date: [new Date('December 17, 1995 03:24:00'), Validators.required],
    });

    this.formGroupRange = this.formBuilder.group({
      textRange: [null],
      dateRange: [null, Validators.required],
    });
    this.formGroupDateTime = this.formBuilder.group({
      text: [null],
      date: [null, Validators.required],
    });

    this.formGroupMonth = this.formBuilder.group({
      dateRequired: [null, Validators.required],
      date: [null],
    });
  }

  calendarPositionOptions = [
    { value: ECalendarPosition.BOTTOM, id: 1 },
    { value: ECalendarPosition.BOTTOM_LEFT, id: 2 },
    { value: ECalendarPosition.BOTTOM_RIGHT, id: 3 },
    { value: ECalendarPosition.TOP, id: 4 },
    { value: ECalendarPosition.TOP_LEFT, id: 5 },
    { value: ECalendarPosition.TOP_RIGHT, id: 6 },
  ];
  calendarPosition = ECalendarPosition.BOTTOM;

  setCalendarPosition(value: ECalendarPosition): void {
    this.calendarPosition = value;
  }
}
