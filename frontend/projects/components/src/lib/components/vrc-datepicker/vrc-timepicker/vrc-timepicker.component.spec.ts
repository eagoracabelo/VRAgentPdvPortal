import { DOCUMENT } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcTimepickerComponent } from './vrc-timepicker.component';

describe('VrcTimepickerComponent', () => {
  let component: VrcTimepickerComponent;
  let fixture: ComponentFixture<VrcTimepickerComponent>;
  let documentInject: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VrcTimepickerComponent],
    }).compileComponents();

    documentInject = TestBed.inject(DOCUMENT);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadStartDate', () => {
    it('should set checked equal true for hour input when calendar is open and have already a setted date', () => {
      const mockSimpleChanges = {
        isOpen: {
          currentValue: true,
        },
      } as unknown as SimpleChanges;
      const mockStartDate = new Date();
      const expectedHoursInput = documentInject.getElementById(
        component.hours[mockStartDate.getHours()].id,
      ) as HTMLInputElement;

      component.startDate = mockStartDate;
      component.ngOnChanges(mockSimpleChanges);

      expect(expectedHoursInput.checked).toBeTrue();
    });

    it('should set checked equal true for minute input when calendar is open and have already a setted date', () => {
      const mockSimpleChanges = {
        isOpen: {
          currentValue: true,
        },
      } as unknown as SimpleChanges;
      const mockStartDate = new Date();
      const expectedMinutesInput = documentInject.getElementById(
        component.minutes[mockStartDate.getMinutes()].id,
      ) as HTMLInputElement;

      component.startDate = mockStartDate;
      component.ngOnChanges(mockSimpleChanges);

      expect(expectedMinutesInput.checked).toBeTrue();
    });

    it('should not set checked equal true for minute input when calendar open event is not trigged', () => {
      const mockSimpleChanges = {} as unknown as SimpleChanges;
      const mockStartDate = new Date();
      const expectedMinutesInput = documentInject.getElementById(
        component.minutes[mockStartDate.getMinutes()].id,
      ) as HTMLInputElement;

      component.startDate = mockStartDate;
      component.ngOnChanges(mockSimpleChanges);

      expect(expectedMinutesInput.checked).toBeFalse();
    });
  });

  describe('timeChange', () => {
    it('should emit new values when hour or minute is selected', () => {
      const spyEvent = spyOn(component.timeSelected, 'emit');
      const mockValue = 10;
      const mockType = 'hour';

      component.timeChange(mockValue, mockType);

      expect(spyEvent).toHaveBeenCalledWith({
        value: Number(mockValue),
        type: mockType,
      });
    });
  });
});
