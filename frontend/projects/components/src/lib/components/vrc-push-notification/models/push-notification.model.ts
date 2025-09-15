import { Subject } from 'rxjs';

export enum NotificationType {
  success = 0,
  warning = 1,
  danger = 2,
  info = 3,
}

export type IPushCSSClass =
  | 'alert-info'
  | 'alert-success'
  | 'alert-warning'
  | 'alert-danger'
  | string;

export interface INotify {
  message: string;
  title: string;
  buttonText?: string;
  exibirMensagemNotificacao?: boolean;
}

export type IPushAlign = 'center' | 'right' | 'left';
export interface INotification {
  id: number;
  type: NotificationType;
  cssClass: IPushCSSClass;
  cssIcon: string;
  cssButton: string;
  align: IPushAlign;
  isNotify: boolean;
  subject$: Subject<boolean>;
  time: number;
  expirationTime: number;
  remainingTime: number;
  message: string;
  buttonText?: string;
  title?: string;
  timeout?: ReturnType<typeof setTimeout>;
  hideCloseButton?: boolean;
  exibirMensagemNotificacao?: boolean;
}
