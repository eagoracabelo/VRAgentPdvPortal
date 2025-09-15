# VR Tree Select

<br>

## Features

<br>

- Seleção única ou múltipla
- Seleção de itens pais ou apenas de itens filhos
- Filtro local
- Desabilitar componente
- Placeholder para o input de seleção
- Placeholder para o input de filtro
- Utilização em formulário
- Status de obrigatório

## Usage

<br>

Para preencher os itens do dropdown, deve-se utilizar o **@Input items** do componente, que aceitar receber um array com objetos do tipo `ITreeSelect`, por exemplo:

```ts
data = [
  {
    value: 1,
    label: 'item 1',
    children: [],
  },
];
```

### Importação

```ts
import { VrcTreeSelectModule } from '...';

@NgModule({
  imports: [VrcTreeSelectModule],
})
class SomeModule {}
```

### Utilização com formulário

```html
<form [formGroup]="formGroup">
  <vrc-tree-select [items]="data" [control]="formControl" formControlName="formControlName" (update)="update($event)"> </vrc-tree-select>
</form>
```

### Utilização sem formulário

```html
<vrc-tree-select [items]="data" [value]="initialValue" <="utilize" esse input apenas se precisar passar um valor selecionado inicial (update)="update($event)"> </vrc-tree-select>
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()                | Tipo                     | Default                                       | Descrição                                                                                                                        |
| ----------------------- | ------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| items                   | object array             | `[]`                                          | preenche os itens do dropdown                                                                                                    |
| value                   | object array ou object   | `undefined`                                   | adiciona um valor selecionado inicial, não é necessário usar quando está passando o controle do formulário                       |
| control                 | FormControl              | `undefined`                                   | atribui o controle do formulário, deve ser usado em conjunto com o atributo `formControlName`                                    |
| defaultOpts \*          | TreeSelectDefaultOptions | `valores default mostrados nos inputs abaixo` | atribui as configurações ao componente, pode ser usados no lugar dos inputs                                                      |
| isRequired \*           | boolean                  | `false`                                       | variável que define se o componente é de preenchimento obrigatório                                                               |
| filterCaseSensitive \*  | boolean                  | `false`                                       | variável que define se o filtro será case sensitive                                                                              |
| placeholder \*          | string                   | `' '`                                         | placeholder do componente                                                                                                        |
| filterPlaceholder \*    | string                   | `' '`                                         | placeholder do filtro do componente                                                                                              |
| allowFilter \*          | boolean                  | `false`                                       | variável que define a exibição do filtro dentro do dropdown                                                                      |
| isDisabled \*           | boolean                  | `false`                                       | variável que define se o componente está desabilitado                                                                            |
| allowParentSelection \* | boolean                  | `false`                                       | variável que define se o componente permite a seleção de items pai, permitido apenas para seleção múltipla                       |
| maxVisibleItemCount \*  | number                   | `0`                                           | variável que define a quantidade de itens selecionados que serão exibidos, no caso do valor ser 0, todos os itens serão exibidos |
| multiple \*             | boolean                  | `false`                                       | variável que define se é possível selecionar mais de um item                                                                     |
| expandMode \*           | string                   | `None`                                        | variável que define como os itens do dropdown serão expandidos no caso de itens filhos, valores possíveis no enum `ExpandMode`   |
| minLevelToSelect        | number                   | 0                                             | variável que define se é possível e qual o nível de seleção da tree                                                              |

| @Output()                  | Tipo         | Descrição                                     |
| -------------------------- | ------------ | --------------------------------------------- |
| update                     | EventEmitter | emite o(s) item(ns) selecionado(s)            |
| onUpdateChildrenAndParents | EventEmitter | emite o(s) item(ns) e filho(s) selecionado(s) |

## Enum ExpandMode

<br>

- **All**: ao clicar no dropdown, todos os itens que tiverem filhos estão expandidos
- **Selection**: ao clicar no dropdown, todos os itens com algum filho selecionado estarão expandidos
- **None**: ao clicar no dropdown, nenhum item estará expandido

## Atenção

<br>

As propriedades **allowParentSelection** e **multiple** estão diretamente relacionadas.

Caso o componente seja utilizado com **allowParentSelection** = **true** não é necessário atribuir um valor para **multiple**, pois ele será automaticamente de seleção múltipla.

Caso o componente seja utilizado com **multiple** = **false**, a propriedade **allowParentSelection** será obrigatoriamente **false**.

As propriedades **allowParentSelection**, **multiple** e **minLevelToSelect** estão diretamente relacionadas.

Caso seja utilizado **minLevelToSelect** = **true**, as outras duas propriedades devem ser **false** obrigatoriamente.

As possibilidades pra essas propriedades são:

| allowParentSelection | multiple  |               |
| -------------------- | --------- | ------------- |
| true                 | true      | **OK**        |
| false                | true      | **OK**        |
| false                | false     | **OK**        |
| ~~true~~             | ~~false~~ | **INCORRETO** |

| minLevelToSelect | allowParentSelection | multiple  |               |
| ---------------- | -------------------- | --------- | ------------- |
| false            | true                 | true      | **OK**        |
| false            | false                | true      | **OK**        |
| false            | false                | false     | **OK**        |
| true             | false                | false     | **OK**        |
| true             | ~~true~~             | ~~false~~ | **INCORRETO** |
| true             | ~~false~~            | ~~true~~  | **INCORRETO** |
