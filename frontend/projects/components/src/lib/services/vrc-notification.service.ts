import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  INotification,
  INotify,
  IPushAlign,
  NotificationType,
} from '../components/vrc-push-notification/models/push-notification.model';

const DEFAULT = 7000;

const baseSuccess = {
  type: NotificationType.success,
  cssClass: 'alert-success',
  cssIcon: 'vr-check_fill',
  cssButton: 'btn--success',
  align: 'center' as IPushAlign,
};

const baseInfo = {
  type: NotificationType.info,
  cssClass: 'alert-info',
  cssIcon: 'vr-info_fill',
  cssButton: 'btn--info',
  align: 'center' as IPushAlign,
};

const baseWarning = {
  type: NotificationType.warning,
  cssClass: 'alert-warning',
  cssIcon: 'vr-warning_fill',
  cssButton: 'btn--warning',
  align: 'center' as IPushAlign,
};

const baseDanger = {
  type: NotificationType.danger,
  cssClass: 'alert-danger',
  cssIcon: 'vr-error_fill',
  cssButton: 'btn--danger',
  align: 'center' as IPushAlign,
};

@Injectable({
  providedIn: 'root',
})
export class VrcNotificationService {
  private _idx = 0;
  notifications = new Map<string, INotification>();

  successNotify(payload: INotify, time = DEFAULT): Subject<boolean> {
    const notification = this.success(payload, time);
    return notification.subject$;
  }

  success(payload: INotify | string, time = DEFAULT): INotification {
    const { message, title, buttonText, isNotify, exibirMensagemNotificacao } =
      this.getData(payload);
    return this.setNotification({
      ...baseSuccess,
      id: this._idx,
      timeout: this.setTimer(message, title as string, time),
      title,
      message,
      buttonText,
      isNotify,
      subject$: new Subject<boolean>(),
      expirationTime: Date.now() + time,
      remainingTime: time,
      time,
      exibirMensagemNotificacao,
    });
  }

  infoNotify(payload: INotify, time = DEFAULT): Subject<boolean> {
    const notification = this.info(payload, time);
    return notification.subject$;
  }

  info(payload: INotify | string, time = DEFAULT): INotification {
    const { message, title, buttonText, isNotify, exibirMensagemNotificacao } =
      this.getData(payload);

    return this.setNotification({
      ...baseInfo,
      id: this._idx,
      timeout: this.setTimer(message, title as string, time),
      title,
      message,
      buttonText,
      isNotify,
      subject$: new Subject<boolean>(),
      expirationTime: Date.now() + time,
      remainingTime: time,
      time,
      exibirMensagemNotificacao,
    });
  }

  warningNotify(payload: INotify, time = DEFAULT): Subject<boolean> {
    const notification = this.warning(payload, time);
    return notification.subject$;
  }

  warning(payload: INotify | string, time = DEFAULT): INotification {
    const { message, title, buttonText, isNotify, exibirMensagemNotificacao } =
      this.getData(payload);

    return this.setNotification({
      ...baseWarning,
      id: this._idx,
      timeout: this.setTimer(message, title as string, time),
      title,
      message,
      buttonText,
      isNotify,
      subject$: new Subject<boolean>(),
      expirationTime: Date.now() + time,
      remainingTime: time,
      time,
      exibirMensagemNotificacao,
    });
  }

  dangerNotify(payload: INotify, time = DEFAULT): Subject<boolean> {
    const notification = this.danger(payload, time);
    return notification.subject$;
  }

  danger(payload: INotify | string, time = DEFAULT): INotification {
    const { message, title, buttonText, isNotify, exibirMensagemNotificacao } =
      this.getData(payload);

    return this.setNotification({
      ...baseDanger,
      id: this._idx,
      timeout: this.setTimer(message, title as string, time),
      title,
      message,
      buttonText,
      isNotify,
      subject$: new Subject<boolean>(),
      expirationTime: Date.now() + time,
      remainingTime: time,
      time,
      exibirMensagemNotificacao,
    });
  }

  private getData(payload: INotify | string): {
    message: string;
    title: string | undefined;
    buttonText: string | undefined;
    isNotify: boolean;
    exibirMensagemNotificacao: boolean | undefined;
  } {
    return typeof payload === 'string'
      ? {
          message: payload,
          title: undefined,
          buttonText: undefined,
          isNotify: false,
          exibirMensagemNotificacao: true,
        }
      : {
          message: payload.message,
          title: payload.title,
          buttonText: payload.buttonText,
          isNotify: true,
          exibirMensagemNotificacao: payload.exibirMensagemNotificacao,
        };
  }

  private setNotification(notification: INotification): INotification {
    this.notifications.set(
      `${notification.message}${notification.title}`,
      notification,
    );
    this._idx++;

    return notification;
  }

  setTimer(
    message: string,
    title: string,
    time: number,
  ): ReturnType<typeof setTimeout> | undefined {
    if (time === 0) return;

    return setTimeout(() => this.clearNotification(message, title), time);
  }

  clearNotification(message: string, title: string, confirm = false): void {
    const notification = this.notifications.get(`${message}${title}`);
    if (!notification) return;

    clearTimeout(notification.timeout);

    notification.subject$.next(confirm);
    notification.subject$.complete();

    this.notifications.delete(`${message}${title}`);
  }

  clearAllNotifications(): void {
    this.notifications.forEach((notification) => {
      this.clearNotification(
        notification.message,
        notification.title as string,
      );
    });
  }
}
