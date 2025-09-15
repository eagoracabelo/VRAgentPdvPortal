import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { IMaskModule } from 'angular-imask';
import { VrcDialogModalDirective } from './directive/vrc-dialog-modal/vrc-dialog-modal.directive';
import { SafePipe } from './pipes/safe.pipe';
import { VrcTranslatorPipe } from './pipes/translator.pipe';

const exports = [SafePipe, VrcTranslatorPipe, VrcDialogModalDirective];

@NgModule({
  declarations: [...exports],
  exports: [...exports],
  imports: [CommonModule, IMaskModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class VrCommonModule {}
