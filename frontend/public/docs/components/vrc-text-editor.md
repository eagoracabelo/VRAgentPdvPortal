# VR Text Editor
<br>

## Features
<br>

- Edição de texto com pré-visualização
- Adicionar formatação ao texto:
  - Parágrafo, Título ou Subtítulo
  - **Negrito**, *Itálico* ou <u>Sublinhado</u>
  - Alinhado à Esquerda, Centralizado ou Alinhado à Direita
  - Maiúsculo ou minúsculo
  - Criar <a style="text-decoration: underline;">links</a>
- Remover formatação do texto
- Colar texto mantendo a formatação original
- Utilização em Form ou ngModel


## Usage
<br>


### Importação

```ts
import { VrcTextEditorModule } from '...';

@NgModule({
  imports: [VrcTextEditorModule],
})
class SomeModule {}
```

### Utilização com formulário

#### Template

```html
  Template
  <form [formGroup]="form">
    <vrc-text-editor
      id="editor"
      formControlName="editor"
      (ngModelChange)="onChange($event)"
      (saveEditing)="onSaveEditing($event)"
      (cancelEditing)="onCancelEditing()"
      (createLink)="onCreateLink()"
      [defaultOptions]="options"
    >
    </vrc-text-editor>
  </form>
```

#### Component

```ts
  public form!: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      editor: ['', [Validators.required]],
    });
  }
```

### Utilização sem formulário

#### Template
```html
    <form [formGroup]="form">
      <vrc-text-editor
        id="editor"
        [(ngModel)]="valueEditor"
        (ngModelChange)="onChange($event)"
        (saveEditing)="onSaveEditing($event)"
        (cancelEditing)="onCancelEditing()"
        (createLink)="onCreateLink()"
        [defaultOptions]="options"
      >
      </vrc-text-editor>
    </form>
```

#### Component
```ts
  public valueEditor: string = '';
```

## Propriedades

Propriedades marcadas com \* sao opcionais

| @Input()          | Tipo    | Default | Descrição                                                              |
| ----------------- | ------- | ------- | ---------------------------------------------------------------------- |
| isDisabled *  | boolean | `false` | Define se o componente está desablitado para edição |
| defaultOptions * | TextEditorDefaultOptions  | `Valores dos inputs abaixo` | Atribui as configurações ao componente, pode ser usado no lugar dos inputs |
| clearPasteFormatting * | boolean | `true`  | Define se a formatação de um texto será removida ao colá-lo na textarea |
| isDisabled * | boolean | `false`  | Define se o componente está desabilitado |
| minHeight * | string | `'2rem'` | Define a altura mínima da área de edição |
| height * | string  | `'auto'` | Define a altura exata da área de edição |
| maxHeight * | string  | `'10rem'` | Define a altura máxima da área de edição |
| minWidth * | string | `'20%'` | Define a largura mínima da área de edição |
| width * | string  | `'auto'` | Define a largura exata da área de edição |
| maxWidth * | string  | `'100%'` | Define a largura máxima da área de edição |
| placeholder * | string | `'Insira o texto aqui'`   | Define o placeholder da textarea |

| @Output()          | Tipo    | Descrição                                                              |
| ----------------- | ------- | ---------------------------------------------------------------------- |
| ngModelChange | EventEmitter | emite as atualizações de valor |
| saveEditing | EventEmitter | emite instrução para Salvar (edição) |
| cancelEditing | EventEmitter | emite instrução para Cancelar (edição) |
 