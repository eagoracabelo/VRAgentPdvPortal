import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { uniqueId } from 'lodash';

@Component({
  selector: 'vrc-timepicker',
  templateUrl: './vrc-timepicker.component.html',
  styleUrls: ['./vrc-timepicker.component.scss'],
})
export class VrcTimepickerComponent implements OnChanges {
  hours = Array.from(Array(24).keys()).map((value) => {
    const id = uniqueId('hour');
    return { value, id };
  });
  minutes = Array.from(Array(60).keys()).map((value) => {
    const id = uniqueId('minute');
    return { value, id };
  });

  @Input()
  startDate?: Date;
  @Input()
  isOpen?: boolean;
  @Output()
  timeSelected = new EventEmitter();
  @ViewChild('hoursContainer', { read: ElementRef })
  hoursContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('minutesContainer', { read: ElementRef })
  minutesContainer!: ElementRef<HTMLDivElement>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.loadStartDate(changes['isOpen']);
  }

  timeChange(value: number, type: string): void {
    this.timeSelected.emit({
      value: Number(value),
      type,
    });
  }

  private loadStartDate(isOpen?: SimpleChange): void {
    if (isOpen?.currentValue && this.startDate) {
      const hourIndex = this.startDate.getHours();
      const minuteIndex = this.startDate.getMinutes();
      const hour = this.hours[hourIndex];
      const minute = this.minutes[minuteIndex];
      const hourInput = this.document.getElementById(
        hour.id,
      ) as HTMLInputElement;
      const minuteInput = this.document.getElementById(
        minute.id,
      ) as HTMLInputElement;

      hourInput.checked = true;
      minuteInput.checked = true;
    }
  }
}
