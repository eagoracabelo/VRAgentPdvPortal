import localePt from '@angular/common/locales/pt';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrCommonModule } from './../../vr-common.module';

import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { VrcDatepickerComponent } from './vrc-datepicker.component';
import { VrcDatepickerModule } from './vrc-datepicker.module';

registerLocaleData(localePt, 'pt-BR');

describe(`${VrcDatepickerComponent.name}`, () => {
  let component: VrcDatepickerComponent;
  let fixture: ComponentFixture<VrcDatepickerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        VrCommonModule,
        VrcDatepickerModule,
      ],
      declarations: [VrcDatepickerComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
