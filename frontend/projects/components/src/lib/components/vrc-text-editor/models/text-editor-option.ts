export interface ITextEditorOption {
  isDisabled?: boolean;
  height?: 'auto' | string;
  minHeight?: '0' | string;
  maxHeight?: 'auto' | string;
  minWidth?: '0' | string;
  width?: 'auto' | string;
  maxWidth?: 'auto' | string;
  placeholder?: string;
  clearPasteFormatting?: boolean;
  publicationDate?: Date | string | null;
}

export class TextEditorOption {
  isDisabled = false;
  height = 'auto';
  minHeight = '0';
  maxHeight = 'auto';
  minWidth = '0';
  width = 'auto';
  maxWidth = 'auto';
  placeholder = '';
  clearPasteFormatting = true;
  publicationDate = null;
}
