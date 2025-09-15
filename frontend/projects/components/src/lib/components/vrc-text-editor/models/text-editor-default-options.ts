export class TextEditorDefaultOptions {
  isDisabled: boolean = false;
  height: string = 'auto';
  minHeight: string = '2rem';
  maxHeight: string = '10rem';
  minWidth: string = '20%';
  width: string = 'auto';
  maxWidth: string = '100%';
  placeholder: string = 'Insira o texto aqui';
  clearPasteFormatting: boolean = true;
  publicationDate: Date | string | null = null;
}
