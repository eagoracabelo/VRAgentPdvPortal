# VR Tree View
<br>

## Features
<br>

- Seleção de itens pais ou apenas de itens filhos
- Filtro local
- Desabilitar componente
- Placeholder para o input de seleção
- Placeholder para o input de filtro
- Utilização em formulário

## Usage
<br>

Para preencher os itens do treeview, deve-se utilizar o **@Input items** do componente, que aceitar receber um array com objetos do tipo `ITreeViewSelect`, por exemplo:

```ts
data = [
   {
      value: 1,
      label: 'item 1',
      children: [
         {
            value: 10,
            label: 'item 10',
            children: []
         }
      ]
   }
]
```

Para preencher os itens do select do filtro, deve-se utilizar o **@Input filterItems** do componente, que aceitar receber um array com objetos do tipo `ITreeViewFilterItem`, por exemplo:

```ts
filterSelectItems = [
   {
      value: 1,
      label: 'item 1',
   }
]
```

O campo select do filtro do componente possui a primeira opção sendo o default, porém é necessário informar o texto dessa opção utilizando o **@Input defaultFilterOption**, por exemplo:

```ts
<vrc-tree-view [defaultFilterOption]="'Todos'"></vrc-tree-view>
```

### Importação

```ts
import { VrcTreeViewModule } from '...';

@NgModule({
  imports: [VrcTreeViewModule],
})
class SomeModule {}
```

### Utilização com formulário

```html
<form [formGroup]="formGroup">
   <vrc-tree-view
      [items]="data"
      [defaultFilterOption]="'Todos'"
      [filterItems]="filterItems"
      [control]="formControl"
      formControlName="formControlName"
      (update)="update($event)">
   </vrc-tree-view>
</form>
```

### Utilização sem formulário
```html
<vrc-tree-view
   [items]="data"
   [defaultFilterOption]="'Todos'"
   [filterItems]="filterItems"
   [value]="initialValue"       <= utilize esse input apenas se precisar passar um valor selecionado inicial
   (update)="update($event)">
</vrc-tree-view>
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()          | Tipo    | Default | Descrição                                                              |
| ----------------- | ------- | ------- | ---------------------------------------------------------------------- |
| items         | `ITreeView[]`  | `[]`      | preenche os itens do dropdown                                    |
| value         | `ITreeView ou ITreeView[]`  | `undefined`      | adiciona um valor selecionado inicial, não é necessário usar quando está passando o controle do formulário                                    |
| defaultFilterOption         | string  | `' '`      | atribui um texto ao item default das opções do select do filtro                                    |
| filterItems         | `ITreeViewFilterItem[]`  | `[]`      | atribui as opções do filtro do tipo select      |
| control       | FormControl  | `undefined`      | atribui o controle do formulário, deve ser usado em conjunto com o atributo `formControlName`                  |
| defaultOpts *       | TreeViewDefaultOptions  | `valores default mostrados nos inputs abaixo`      | atribui as configurações ao componente, pode ser usados no lugar dos inputs                     |
| isRequired * | boolean | `false`   | variável que define se o componente é de preenchimento obrigatório |
| filterCaseSensitive * | boolean | `false`  | variável que define se o filtro será case sensitive |
| placeholder * | string | `' '`   | placeholder do componente |
| filterPlaceholder * | string | `' '`   | placeholder do filtro do componente |
| allowFilter * | boolean | `false`  | variável que define a exibição do filtro dentro do dropdown |
| isDisabled * | boolean | `false`  | variável que define se o componente está desabilitado |
| allowParentSelection * | boolean | `false`  | variável que define se o componente permite a seleção de items pai, permitido apenas para seleção múltipla |
| multiple * | boolean | `false`  | variável que define se é possível selecionar mais de um item |
| expandMode * | string | `None`  | variável que define como os itens do dropdown serão expandidos no caso de itens filhos, valores possíveis no enum `TreeViewExpandMode` |
| templates * | `TemplateRef` or `{option?: TemplateRef, group?: TemplateRef}` or `{templateId1: TemplateRef, ...}` |          | use templates para formatar o conteúdo (see [Templating](#templating))        |

| @Output()          | Tipo    | Descrição                                                              |
| ----------------- | ------- | ---------------------------------------------------------------------- |
| update | EventEmitter | emite o(s) item(ns) selecionado(s) |

## Enum TreeViewExpandMode  
<br>

- **All**: ao clicar no dropdown, todos os itens que tiverem filhos estão expandidos
- **Selection**: ao clicar no dropdown, todos os itens com algum filho selecionado estarão expandidos
- **None**: ao clicar no dropdown, nenhum item estará expandido

## Atenção
<br>

As propriedades **allowParentSelection** e **multiple** estão diretamente relacionadas.

Caso o componente seja utilizado com **allowParentSelection** = **true** não é necessário atribuir um valor para **multiple**, pois ele será automaticamente de seleção múltipla.

Caso o componente seja utilizado com **multiple** = **false**, a propriedade **allowParentSelection** será obrigatoriamente **false**.

As possibilidades pra essas propriedades são:

| allowParentSelection | multiple | |
|--|--|--|
| true | true | **OK** |
| false | true | **OK** |
| false | false | **OK** |
| ~~true~~ | ~~false~~ | **INCORRETO** |

