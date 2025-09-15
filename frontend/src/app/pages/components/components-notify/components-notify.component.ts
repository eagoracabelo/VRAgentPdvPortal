import { Component } from '@angular/core';
import { INotify, VrcNotificationService } from '@vrsoftbr/vr-components';
import { take, tap } from 'rxjs';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-notify',
  templateUrl: './components-notify.component.html',
  styleUrls: ['./components-notify.component.scss'],
})
export class ComponentsNotifyComponent extends MarkdownCommon {
  constructor(private readonly _notificationService: VrcNotificationService) {
    super();
  }

  onDanger(timeout?: number): void {
    if (timeout === 0) {
      this._notificationService.danger('Mensagem de erro! (fixo)', timeout);
    } else {
      this._notificationService.danger('Mensagem de erro!');
    }
  }

  onInfo(timeout?: number): void {
    if (timeout === 0) {
      this._notificationService.info(
        {
          message:
            'Mensagem de informação muito muito muito muito grande! (fixo)',
          buttonText: 'teste',
          title: '',
        },
        timeout,
      );
    } else {
      this._notificationService.info('Mensagem de informação!');
    }
  }

  onSuccess(timeout?: number): void {
    if (timeout === 0) {
      this._notificationService.success('Mensagem de sucesso! (fixo)', timeout);
    } else {
      this._notificationService.success('Mensagem de sucesso!');
    }
  }

  onWarning(timeout?: number): void {
    if (timeout === 0) {
      this._notificationService.warning('Mensagem de alerta! (fixo)', timeout);
    } else {
      this._notificationService.warning('Mensagem de alerta!');
    }
  }

  onClearAllNotifications(): void {
    this._notificationService.clearAllNotifications();
  }

  onDangerNotify(): void {
    const payload: INotify = {
      title: 'A importação falhou!',
      message: 'A importação do documento X falhou.',
      buttonText: 'Visualizar',
    };

    this._notificationService
      .dangerNotify(payload, 5000)
      .pipe(
        tap((confirm) => console.log('Reposta danger notify: ', confirm)),
        take(1),
      )
      .subscribe();
  }

  onInfoNotify(): void {
    const payload: INotify = {
      title: 'Informações sobre a importação!',
      message: 'A importação do documento X tem informações.',
      buttonText: 'Conferir informação',
    };

    this._notificationService
      .infoNotify(payload, 5000)
      .pipe(
        tap((confirm) => console.log('Reposta info notify: ', confirm)),
        take(1),
      )
      .subscribe();
  }

  onSuccessNotify(): void {
    const payload: INotify = {
      title: 'Importação concluída com sucesso!',
      message: 'A importação do documento X foi concluída.',
      buttonText: 'Visualizar',
    };

    this._notificationService
      .successNotify(payload, 5000)
      .pipe(
        tap((confirm) => console.log('Reposta success notify: ', confirm)),
        take(1),
      )
      .subscribe();
  }

  onWarningNotify(): void {
    const payload: INotify = {
      title: 'Atenção na importação!',
      message: 'A importação do documento X teve warnings.',
    };

    this._notificationService
      .warningNotify(payload, 5000)
      .pipe(
        tap((confirm) => console.log('Reposta warning notify: ', confirm)),
        take(1),
      )
      .subscribe();
  }
}
