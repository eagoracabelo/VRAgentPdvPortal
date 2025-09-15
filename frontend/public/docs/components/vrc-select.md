# VR Select (Select2)

This Angular CLI module it's a fork of [ng-select2](https://github.com/Harvest-Dev/ng-select2).

## Features

- select one
- options or groups
- scroll
- local search
- select by keyboard
- disabled option
- disabled component
- hide search box
- placeholder
- multiple selection
- material style
- form binding
- templating
- translate

## Usage

### example

```ts
import { Select2Module } from 'ng-select2-component';

@NgModule({
  imports: [BrowserModule, FormsModule, Select2Module],
  declarations: [MainComponent],
  bootstrap: [MainComponent],
})
class MainModule {}
```

```ts
  <select2
    [data]="data"
    [value]="value"
    (update)="update($event)">
  </select2>
```

### Translator

- opcoes:

  - Nao obrigatorio `Select2Module.forRoot(TranslatorPipe)` pode ser usado somente `Select2Module` sem a opcao de traducao.
  - Pode ser usado `Select2Module.forRoot(TranslatorPipe)` e `<vrc-select [translate]='false'></vrc-select>` para uma opcao que nao tenha tags de traducao no component.
  - A opcao translate default e true, essa opcao so tera efeito se combinado com o `Select2Module.forRoot(TranslatorPipe)` ou sera ignorada.

- Exemplo do Pipe de traducao tem que conter para a traducao ou sera ignorado
- No VRMasterWeb so passar o pipe de traducao ja existente **TranslatorPipe**

```ts
class TranslatorPipe {
  get translatorChange(): EventEmitter<ITranslatorEventEmitter>;
  transform(value: any, ...args: any[]): string;
}
```

- Exemplo Modulo

```ts
import { VrcSelectModule } from '@vrsoftbr/vr-components';

@NgModule({
  imports: [BrowserModule, FormsModule, Select2Module.forRoot(TranslatorPipe)],
  declarations: [MainComponent],
  bootstrap: [MainComponent],
})
class MainModule {}
```

- Exemplo Html para nao traduzir as opcoes do Select

```ts
<div class="col-sm-4">
  <vrc-select
    [translate]="false"
    displaySearchStatus="hidden"
    [data]="indicativoCPRB$ | async"
    [control]="indicativoCPRB"
    [value]="indicativoCPRB?.value"
    [formControl]="indicativoCPRB">
    {{ 'COMMONS.INDICATIVO-CPRB' | translator }}
  </vrc-select>
</div>
```

- Exemplo data

```json
[
  {
    "value": 0,
    "label": "ENUMS.INDICATIVO-CPRB.NAO-CONTRIBUINTE"
  },
  {
    "value": 1,
    "label": "ENUMS.INDICATIVO-CPRB.CONTRIBUINTE"
  }
]
```

### OVERLAY (ANGULAR CDK) `OPCIONAL`

- Observações:

  - Esse atributo e opcional e so sera ativada se a opção overlay for true.
  - Com a opção aitva o CDK vai fazer todo o controle de sobrepor o dropdown.
  - O Dropdown vai ficar sobre qualquer elemento que esteja na tela.
  - Referencia na versão do `Angular 15.2.9` a verão compativel do `ng-select2 v11.1.0` [https://github.com/Harvest-Dev/ng-select2/tree/v11.1.0](https://github.com/Harvest-Dev/ng-select2/tree/v11.1.0)

- opcoes:

  - Se adicionado `overlay` no componente `vrc-select` com opção `true`.
  - Obrigatório a adição da dependencia do CDK relativo com a verão do Angular usado `npm i -S @angular/cdk@15.2.9`.
  - Obrigatório a adição do `@import '@angular/cdk/overlay-prebuilt.css';` no style principal.
  - Opções de dropdown com overlay do CDK `listPosition` com as opções, `below` | `above` | `auto` o default é `below`.

- Exemplo

```ts
  <vrc-select
      class="reset-form-group"
      [data]="data2"
      [translate]="false"
      [hideLabel]="true"
      resetAllSelected="true"
      [overlay]="true"
      listPosition="below"
    >
      {{ 'SELECT' }}
  </vrc-select>
```

### properties and events of the component

| name                                                           | type                                                                                                | status   | default     | description                                                                 |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- | ----------- | --------------------------------------------------------------------------- |
| `data`                                                         | [`Select2Data`](#select2-data-structure)                                                            | required |             | the data of the select2                                                     |
| `value`                                                        | [`Select2Value`](#select2-data-structure)                                                           |          |             | initial value                                                               |
| `disabled`                                                     | `boolean`                                                                                           |          |             | whether the component is disabled                                           |
| `minCharForSearch`                                             | `number`                                                                                            |          | `0`         | start the search when the number of characters is reached (`0` = unlimited) |
| `minCountForSearch`                                            | `number`                                                                                            |          | `6`         | hide search box if `options.length < minCountForSearch`                     |
| `displaySearchStatus`                                          | `'default'` or `'hidden'` or `'always'`                                                             |          | `'default'` | display the search box (`default` : is based on `minCountForSearch`)        |
| `placeholder`                                                  | `string`                                                                                            |          |             | the placeholder string if nothing selected                                  |
| `customSearchEnabled`                                          | `boolean`                                                                                           |          |             | will trigger `search` event, and disable inside filter                      |
| `multiple`                                                     | `boolean`                                                                                           |          |             | select multiple options                                                     |
| `limitSelection`                                               | `number`                                                                                            |          | `0`         | to limit multiple selection (`0` = unlimited)                               |
| `hideSelectedItems`                                            | `boolean`                                                                                           |          |             | for `multiple`, remove selected values                                      |
| `resultMaxHeight`                                              | `string`                                                                                            |          |             | change the height size of results                                           |
| `listPosition`                                                 | `'above'` or `'below'` or `'auto'` or `null` or `defined`                                           |          | `'below'`   | the position for the dropdown list                                          |
| `nostyle`                                                      | `""` or `true` or `'true'`                                                                          |          |             | remove border and background color                                          |
| `templates`                                                    | `TemplateRef` or `{option?: TemplateRef, group?: TemplateRef}` or `{templateId1: TemplateRef, ...}` |          |             | use templates for formatting content (see [Templating](#templating))        |
| `selectedOptionTemplate`                                       | `TemplateRef`                                                                                       |          |             | use it for customize the label of selected option                           |
| `editPattern`                                                  | `(str: string) => string`                                                                           |          |             | use it for change the pattern of the filter search                          |
| `ngModel`/`id`/`required`/<br>`disabled`/`readonly`/`tabIndex` |                                                                                                     |          |             | just like a `select` control                                                |
| `(update)`                                                     | `(event: `[`Select2UpdateEvent`](#select2-data-structure)`) => void`                                | event    |             | triggered when user select an option                                        |
| `(open)`                                                       | `(event: Select2) => void`                                                                          | event    |             | triggered when user open the options                                        |
| `(close)`                                                      | `(event: Select2) => void`                                                                          | event    |             | triggered when user close the options                                       |
| `(focus)`                                                      | `(event: Select2) => void`                                                                          | event    |             | triggered when user enters the component                                    |
| `(blur)`                                                       | `(event: Select2) => void`                                                                          | event    |             | triggered when user leaves the component                                    |
| `(search)`                                                     | `(event: `[`Select2SearchEvent`](#select2-data-structure)`) => void`                                | event    |             | triggered when search text changed                                          |
| `translate`                                                    | `boolean`                                                                                           |          | `true`      | when you don't want to translate a specific component                       |
| `enableExternalSearch`                                         | `boolean`                                                                                           |          | `false`     | enables the external search                                                 |
| `(externalSearchEvent$)`                                       | `(event: void) => void`                                                                             | event    |             | triggered when user clicks the external search icon                         |
| `overlay`                                                      | `boolean`                                                                                           |          | false       | active overaly by Google CDK                                                |
| `mask`                                                         | `Record<string, unknown>`                                                                           |          | `false`     | use it for add mask                                                         |

### select2 data structure

```ts
type Select2Data = (Select2Group | Select2Option)[];

export interface Select2Group {
  /** label of group */
  label: string;
  /** options list */
  options: Select2Option[];
  /** add classes  */
  classes?: string;
  /** template id  */
  templateId?: string;
  /** template data  */
  data?: any;
}

export interface Select2Option {
  /** value  */
  value: Select2Value;
  /** label of option */
  label: string;
  /** no selectable is disabled */
  disabled?: boolean;
  /** for identification */
  id?: string;
  /** add classes  */
  classes?: string;
  /** template id  */
  templateId?: string;
  /** template data  */
  data?: any;
}

type Select2Value = string | number | boolean;

type Select2UpdateValue = Select2Value | Select2Value[];

export interface Select2UpdateEvent<U extends Select2UpdateValue = Select2Value> {
  component: Select2;
  value: U;
  options: Select2Option[];
}

export interface Select2SearchEvent<U extends Select2UpdateValue = Select2Value> {
  component: Select2;
  value: U;
  search: string;
}
```

### Templating

#### Unique template

```ts
<select2
  [data]="data"
  [templates]="template">
  <ng-template #template let-data="data"><strong>{{data?.color}}</strong>: {{data?.name}}</ng-template>
</select2>
```

```ts
const data: Select2Data = [
  {
    value: 'heliotrope',
    label: 'Heliotrope',
    data: { color: 'white', name: 'Heliotrope' },
  },
  {
    value: 'hibiscus',
    label: 'Hibiscus',
    data: { color: 'red', name: 'Hibiscus' },
  },
];
```

#### Template group & option

```ts
<select2
  [data]="data"
  [templates]="{option : option, group: group}">
  <ng-template #option let-data="data">{{data?.name}}</ng-template>
  <ng-template #group let-label="label">Group: {{label}}</ng-template>
</select2>
```

No difference in data structure.
The template is defined by its type, option or group, automatically.

#### Template by templateId

```ts
<select2
  [data]="data"
  [templates]="{template1 : template1, template2: template2">
  <ng-template #template1 let-data="data">{{data?.name}}</ng-template>
  <ng-template #template2 let-label="label" let-data="data">{{label}} : {{data?.color}}</ng-template>
</select2>
```

```ts
const data: Select2Data = [
  {
    value: 'heliotrope',
    label: 'Heliotrope',
    data: { color: 'white', name: 'Heliotrope' },
    templateId: 'template1',
  },
  {
    value: 'hibiscus',
    label: 'Hibiscus',
    data: { color: 'red', name: 'Hibiscus' },
    templateId: 'template2',
  },
];
```

#### Templating Selected Option (Unique and Multiple)

```ts
<select2
  [data]="data"
  [selectedOptionTemplate]="template">
  <ng-template #template let-selectedOption="selectedOption">{{ selectedOption }}</ng-template>
</select2>
```

```ts
const data: Select2Data = [
  {
    value: 'heliotrope',
    label: 'Heliotrope',
    data: { color: 'white', name: 'Heliotrope' },
    templateId: 'template1',
  },
  {
    value: 'hibiscus',
    label: 'Hibiscus',
    data: { color: 'red', name: 'Hibiscus' },
    templateId: 'template2',
  },
];
```

## CSS variables (doesn't work on IE11)

It's possible to change different colors (and more) with CSS variables without having to modify them with `::ng-deep` or other CSS rules :

```scss
:root {
  /* selection */
  --select2-selection-border-radius: 2px;
  --select2-selection-background: var(--background-color-select-theme);
  --select2-selection-disabled-background: transparent;
  --select2-selection-disabled-border-color: var(--border-color-select-theme);
  --select2-selection-disabled-text-color: var(--color-7);
  --select2-selection-border-color: var(--border-color-select-theme);
  --select2-selection-focus-border-color: var(--border-color-input--active);
  --select2-selection-text-color: var(--color-text);

  /* selection: choice item (multiple) */
  --select2-selection-choice-background: var(--color-7);
  --select2-selection-choice-text-color: var(--color-0);
  --select2-selection-choice-border-color: var(--border-color-input--active);
  --select2-selection-choice-close-color: var(--color-4);
  --select2-selection-choice-hover-close-color: var(--background-select-body-hover);

  /* placeholder */

  --select2-placeholder-color: var(--color-placeholder, #888888);

  /* arrow */
  --select2-arrow-color: var(--color-text);

  /* dropdown panel */
  --select2-dropdown-background: var(--background-color-select-theme);
  --select2-dropdown-border-color: 1px solid var(--color-4);
  --select2-dropdown-box-shadow: 0px 3px 6px #00000029;

  /* dropdown option */
  --select2-option-text-color: var(--color-text);
  --select2-option-disabled-text-color: var(--color-4);
  --select2-option-disabled-background: transparent;
  --select2-option-selected-text-color: var(--color-text);
  --select2-option-selected-background: var(--color-0);
  --select2-option-highlighted-text-color: var(--color-text-default, #fff);
  --select2-option-highlighted-background: var(--color-default, #e95c13);
  --select2-option-group-text-color: var(--color-5);
  --select2-option-group-background: transparent;

  /* hint */
  --select2-hint-text-color: var(--color-4);

  &[theme='light'] {
    --select2-option-selected-background: var(--color-6);
    --select2-selection-disabled-border-color: var(--color-6);
    --select2-selection-disabled-text-color: var(--color-4);
  }
}
```
