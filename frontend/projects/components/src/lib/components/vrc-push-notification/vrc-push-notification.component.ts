import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';
import { VrcNotificationService } from '../../services/vrc-notification.service';
import { INotification } from './models/push-notification.model';

@Component({
  selector: 'vrc-push-notification',
  templateUrl: './vrc-push-notification.component.html',
  styleUrls: ['./vrc-push-notification.component.scss'],
  animations: [
    trigger('fadeAnimationNotification', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
        }),
      ),
      state(
        'closed',
        style({
          transform: 'translateX(400px)',
        }),
      ),
      transition('closed => open', [animate('300ms ease')]),
    ]),
  ],
})
export class VrcPushNotificationComponent {
  constructor(private readonly _notificationService: VrcNotificationService) {}

  get notifications(): INotification[] {
    const array = Array.from(this._notificationService.notifications.entries());
    return array.map((item) => item[1]);
  }

  clearNotification(message: string, title: string, confirm = false): void {
    this._notificationService.clearNotification(message, title, confirm);
  }

  freezeNotification(notification: INotification): void {
    if (notification.time === 0) return;

    clearTimeout(notification.timeout);
    notification.remainingTime = notification.expirationTime - Date.now();
  }

  unFreezeNotification(notification: INotification): void {
    if (notification.time === 0) return;

    notification.timeout = this._notificationService.setTimer(
      notification.message,
      notification.title as string,
      notification.remainingTime,
    );
    notification.expirationTime = Date.now() + notification.remainingTime;
  }
}
