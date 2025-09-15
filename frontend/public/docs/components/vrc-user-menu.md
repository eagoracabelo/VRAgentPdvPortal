# VR User Menu
Esse componente é um botão de menu que deve ser unico e posicionado sempre a direita do nav-bar, clicando no botão será exibido um menu suspenso.<br>
O componente tem o layout dividido em três partes, informações do usuário logado, configuração de tema e area para informações dinamiacas.

#### Informações do Usuário
Somente será exibido somente quando for passado para o componente o input `userInfo`.<br>
Nessa seção será exibido `Nome do usuário`, `Email` e o botão `sair da conta` que retorna uma `output onLogout()`.

#### Configuração de Thema
Será sempre exibido, e será possivel escolher entre os temas `escuro` e `claro`.<br>
Caso tenha dentro da mesma tela dois seletores de temas, deve ser utilizado a output `radioGroupName` para que o app consiga diferencia os grupos.

#### Informações dinamicas
Somente será exbido quando for passado conteudos HTML dentro da tag vrc-user-menu<br>
As informações serão exibidas sempre como ultima conteudo do menu suspenso.

### Como usar o componente `VrcUserMenu` :
Para usar o vrc-user-menu é necessário importar o módulo e então poderá usa-lo como um componente.

```typescript
import { NgModule } from '@angular/core';

import { VrcUserMenuModule } from 'vrc-components';

@NgModule({
  imports: [VrcUserMenuModule],
})
export class MyModule {}
```

template:

```html
<vrc-user-menu
  [user]="{ name: 'User Name', email: 'user@mail.com'}"
>
  <h3>Loja 1</h3>
  <span>VR Software</span>
</vrc-user-menu>
```

## Propriedades

| _@Input()      | Tipo                   | Default     | Descrição                                          |
| -------------- | ---------------------- | ----------- | -------------------------------------------------- |
| userInfo       | Object                 | `undefined` | recebe objeto `{ nome: string; email, string}`     |
| radioGroupName | string                 | `theme`     | recebe nome do group dos radios                    |


| _@Output()  | Tipo                  | Default     | Descrição                                              |
| ----------- | --------------------- | ----------- | ------------------------------------------------------ |
| onLogout()  | EventEmitter<boolean> | `undefined` | emite `true` quando clicado no botão sair da conta     |

### Exemplo

```typescript
import { Component } from '@angular/core';
('@angular/forms');

@Component({
  selector: 'vr-my',
  template: `
    <vrc-user-menu [user]="userLogged" (onLogout)="logout()">
      <h3>Loja 1</h3>
      <span>VR Software</span>
    </vrc-user-menu>
  `,
})
export class MyComponent {
  userLogged = {
    name: 'Usuário',
    email: 'usuario@mail.com'
  };
}
```
