# VR Push Notification

### Como usar o componente `VrcPushNotification` :

Para usar o ´vr push notification´ precisa primeiro importar o seu modulo de preferencia no componente main da aplicação, e então usar seu componente no template.

```typescript
import { Component } from '@angular/core';

@Component({
  template: `
    <main class="wrapper">
      <vr-navbar></vr-navbar>
      <vrc-push-notification></vrc-push-notification>
      ...
    </main>
  `,
})
export class MainComponent {}
```

Após ter configurado o componete 'vrc-push-notification' no componete main, pode-se lançar as notificações utilizando o serviço 'VrcNotificationService', como no exemplo abaixo:

```typescript
import { Component } from '@angular/core';
import { VrcNotificationService } from 'vrc-components';

@Component({
  selector: 'vr-my',
  template: `<button class="btn btn--danger" (click)="onDanger()">
    Danger
  </button>`,
})
export class MyComponent {
  constructor(private readonly _notificationService: VrcNotificationService) {}

  onDanger(): void {
    this._notificationService.danger('Mensagem de erro!');
  }
}
```

## Propriedades

Propriedades _VrcNotificationService_

|          |                                               |
| -------- | --------------------------------------------- |
| danger   | envia uma notification de erro                |
| info     | envia uma notification de informação          |
| success  | envia uma notification de sucesso             |
| warning  | envia uma notification de atenção             |
| any      | envia uma notification personalizada          |
| clearAll | exclui todas as notificações                  |
| clear    | exclui uma notification especifica            |
| startId  | inicializa os id de controle das notificações |

## Notificação Personalizada

```typescript
import { Component } from '@angular/core';
import {
  NotificationType,
  PushNotification,
  VrcNotificationService,
} from 'vrc-components';

@Component({
  selector: 'vr-my',
  template: `<button class="btn btn--secondary" (click)="onCustomized()">
    Customized
  </button>`,
})
export class MyComponent {
  constructor(private readonly _notificationService: VrcNotificationService) {}

  onCustomized(): void {
    const notification = new PushNotification(
      200,
      NotificationType.warning,
      'alert-cutomized',
      'vr-flash',
      'btn--warning',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit!',
      5000,
      'right',
      false,
    );

    this._notificationService.any(notification);
  }
}
```

### `PushNotification` :

Propriedades _PushNotification_ passadas pelo construtor.

|                  |                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| id               | Pode-se usar um numero ou uma string.                                                            |
| type             | Tipo da notificação. Pode ser 'danger', 'info', 'success' ou 'warning'.                          |
| cssClass         | Pode ser qualquer valor de string; Utilizado para modificar a aparencia da notificação           |
| cssIcon          | O icone a ser mostrado.                                                                          |
| cssButton        | O estilo do botão.                                                                               |
| message          | Mensagem de apresentação.                                                                        |
| timeout          | Tempo de duração da notificação. **O varor 0 faz a notificação ficar como fixa.**                |
| aling            | Alinhamento da notificação. Pode ser 'center', 'right' ou'left', sendo que o 'center' é o padrão |
| showButtonAction | Visualizão do botão de exclusão da notificação, o padrão é 'true'                                |
