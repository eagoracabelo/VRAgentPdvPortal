import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Provider,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VrcModalService } from '../../services/vrc-modal.service';
import { stringHasLowerCase } from '../../shared/utils/utils';
import { TextEditorDefaultOptions } from './models/text-editor-default-options';
import { TextEditorService } from './services/vrc-text-editor.service';
import { VrcTextEditorLinkModalComponent } from './vrc-text-editor-link-modal/vrc-text-editor-link-modal.component';
import { VrcTextEditorToolbarComponent } from './vrc-text-editor-toolbar/vrc-text-editor-toolbar.component';

export const CUSTOM_TEXT_EDITOR_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcTextEditorComponent),
  multi: true,
};

@Component({
  selector: 'vrc-text-editor',
  templateUrl: './vrc-text-editor.component.html',
  styleUrls: ['./vrc-text-editor.component.scss'],
  providers: [CUSTOM_TEXT_EDITOR_CONTROL_VALUE_ACCESSOR],
})
export class VrcTextEditorComponent implements ControlValueAccessor {
  @Input() id = 'editor';
  @Input() defaultOptions: TextEditorDefaultOptions =
    new TextEditorDefaultOptions();

  @Input()
  set isDisabled(value: boolean) {
    this._editorService.setOptions({ isDisabled: value });
  }
  get isDisabled(): boolean {
    return this._editorService.options.isDisabled;
  }

  @Input()
  set minHeight(value: string) {
    this._editorService.setOptions({ minHeight: value });
  }
  get minHeight(): string {
    return this._editorService.options.minHeight;
  }

  @Input()
  set height(value: string) {
    this._editorService.setOptions({ height: value });
  }
  get height(): string {
    return this._editorService.options.height;
  }

  @Input()
  set maxHeight(value: string) {
    this._editorService.setOptions({ maxHeight: value });
  }
  get maxHeight(): string {
    return this._editorService.options.maxHeight;
  }

  @Input()
  set minWidth(value: string) {
    this._editorService.setOptions({ minWidth: value });
  }
  get minWidth(): string {
    return this._editorService.options.minWidth;
  }

  @Input()
  set width(value: string) {
    this._editorService.setOptions({ width: value });
  }
  get width(): string {
    return this._editorService.options.width;
  }

  @Input()
  set maxWidth(value: string) {
    this._editorService.setOptions({ maxWidth: value });
  }
  get maxWidth(): string {
    return this._editorService.options.maxWidth;
  }

  @Input()
  set placeholder(value: string) {
    this._editorService.setOptions({ placeholder: value });
  }
  get placeholder(): string {
    return this._editorService.options.placeholder;
  }

  @Input()
  set clearPasteFormatting(value: boolean) {
    this._editorService.setOptions({ clearPasteFormatting: value });
  }
  get clearPasteFormatting(): boolean {
    return this._editorService.options.clearPasteFormatting;
  }

  @Input()
  set publicationDate(value: Date | string | null) {
    this._editorService.setOptions({ publicationDate: value });
  }
  get publicationDate(): Date | string | null {
    return this._editorService.options.publicationDate;
  }

  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('saveEditing') saveEditingEvent: EventEmitter<string> =
    new EventEmitter<string>();
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('cancelEditing') cancelEditingEvent: EventEmitter<unknown> =
    new EventEmitter<unknown>();

  @ViewChild('editor', { static: true })
  textArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('editorWrapper', { static: true }) editorWrapper!: ElementRef;
  @ViewChild('editorToolbar') editorToolbar!: VrcTextEditorToolbarComponent;

  showPlaceholder: boolean = true;
  disabled: boolean = false;
  focused: boolean = false;
  touched: boolean = false;
  changed: boolean = false;
  editing: boolean = false;
  savedSelection: Range = new Range();
  selectedText: string = '';
  linkSelected: boolean = false;

  constructor(
    private readonly _editorService: TextEditorService,
    private readonly _vrcModalService: VrcModalService,
  ) {
    this.isDisabled = this.defaultOptions.isDisabled;
    this.height = this.defaultOptions.height;
    this.minHeight = this.defaultOptions.minHeight;
    this.maxHeight = this.defaultOptions.maxHeight;
    this.minWidth = this.defaultOptions.minWidth;
    this.width = this.defaultOptions.width;
    this.maxWidth = this.defaultOptions.maxWidth;
    this.placeholder = this.defaultOptions.placeholder;
    this.clearPasteFormatting = this.defaultOptions.clearPasteFormatting;
    this.publicationDate = this.defaultOptions.publicationDate;
  }

  onCreateLink(): void {
    this._vrcModalService
      .onOpen(VrcTextEditorLinkModalComponent)
      .confirm$.subscribe((url) => {
        const replacedUrl = (url as string)?.replace(/\s/g, '');
        this.handleCommands(
          'insertHtml',
          `<a title="${replacedUrl}" href="${replacedUrl}" target="_blank">${this.selectedText}</a>`,
        );
      });
  }

  onPaste(event: ClipboardEvent): void {
    if (!event.clipboardData) return;

    let textType: 'text/html' | 'text/plain' = 'text/html';

    if (this.clearPasteFormatting) {
      event.preventDefault();
      textType = 'text/plain';
    }

    const text = event.clipboardData.getData(textType);
    this._editorService.executeDocumentCommand('insertHTML', text);
  }

  handleCommands(command?: string, value?: string): void {
    if (command) this.executeCommand(command, value);
    this.checkIfSelectedRangeHasLink();
    this._editorService.onToggleActive();
  }

  focus(): void {
    this.textArea.nativeElement.focus();
    this.focused = true;
    this.editing = true;
  }

  blur(): void {
    this.saveSelection();
    this.textArea.nativeElement.blur();
    this.focused = false;
  }

  onContentChange(element: HTMLElement): void {
    const htmlContent = element.innerHTML;
    this.onChange(htmlContent);
    this.showPlaceholder = typeof this.onChange !== 'function' || !htmlContent;
    this.changed = true;
  }

  registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this.setInitialTextAreaValue(value);
  }

  saveSelection(): void {
    const selection = this._editorService.getDocumentSelection();

    if (selection?.getRangeAt && selection.rangeCount) {
      this.savedSelection = selection.getRangeAt(0);
      this.selectedText = selection.toString();
    }
  }

  onSave(): void {
    this.saveEditingEvent.emit(this.textArea.nativeElement.innerHTML);
    this.editing = false;
    this.blur();
  }

  onCancel(): void {
    this.cancelEditingEvent.emit();
    this.editing = false;
    this.blur();
  }

  onTouched(): void {
    /*Empty*/
  }

  private onChange(_: string): void {
    /*Empty*/
  }

  private setInitialTextAreaValue(value: string): void {
    this.showPlaceholder = !value || value === '';
    this.textArea.nativeElement.innerHTML = value;
  }

  private executeCommand(command: string, value?: string): void {
    const commands = ['h1', 'h2', 'p'];

    if (commands.includes(command)) {
      return this._editorService.executeDocumentCommand('formatBlock', command);
    }

    if (command === 'toggleCase') {
      return this.toggleCase();
    }

    if (command === 'insertHtml') {
      this.restoreSelection();
    }

    this._editorService.executeDocumentCommand(command, value);
    this.focus();
  }

  private checkIfSelectedRangeHasLink(): void {
    const userSelection = this._editorService.getDocumentSelection();
    if (!userSelection) return;

    this.saveSelection();

    let node = userSelection.focusNode;
    const elements = [];
    while (node && (node as HTMLElement).id !== 'editor') {
      elements.unshift(node);
      node = node.parentNode;
    }

    this.linkSelected = elements.findIndex((x) => x.nodeName === 'A') > -1;
  }

  private restoreSelection(): void {
    const selection = this._editorService.getDocumentSelection();
    if (!selection) return;

    selection.removeAllRanges();
    selection.addRange(this.savedSelection);
  }

  private toggleCase(): void {
    let selectedText = this._editorService.getDocumentSelection()?.toString();

    if (!selectedText) return;

    selectedText = stringHasLowerCase(selectedText)
      ? selectedText.toUpperCase()
      : selectedText.toLowerCase();

    return this._editorService.executeDocumentCommand(
      'insertText',
      selectedText,
    );
  }
}
