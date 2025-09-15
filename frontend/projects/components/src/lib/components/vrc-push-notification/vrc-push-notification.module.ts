import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VrcIconModule } from '../vrc-icon';
import { VisibleNotificationPipe } from './pipes/is-visible-notification.pipe';
import { VrcPushNotificationComponent } from './vrc-push-notification.component';

const exports = [VrcPushNotificationComponent];

@NgModule({
  declarations: [...exports, VisibleNotificationPipe],
  exports,
  imports: [CommonModule, VrcIconModule],
})
export class VrcPushNotificationModule {}
