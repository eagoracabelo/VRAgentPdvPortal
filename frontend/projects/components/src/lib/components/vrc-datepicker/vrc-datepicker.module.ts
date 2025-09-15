import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { IMaskModule } from 'angular-imask';

import { VrCommonModule } from '../../vr-common.module';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrcTooltipModule } from '../vrc-tooltip/vrc-tooltip.module';
import { DateMaskDirective } from './date.imask.directive';
import { VrcCalendarEventsService } from './service/vrc-calendar-events.service';
import { VrcCalendarComponent } from './vrc-calendar/vrc-calendar.component';
import { VrcDatepickerComponent } from './vrc-datepicker.component';
import { VrcTimepickerComponent } from './vrc-timepicker/vrc-timepicker.component';

const exports = [VrcDatepickerComponent, DateMaskDirective];

@NgModule({
  declarations: [VrcCalendarComponent, VrcTimepickerComponent, ...exports],
  exports,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VrCommonModule,
    IMaskModule,
    VrcErrorMsgModule,
    VrcTooltipModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([withHttpCacheInterceptor()])),
    provideHttpCache(),
    VrcCalendarEventsService,
  ],
})
export class VrcDatepickerModule {}
