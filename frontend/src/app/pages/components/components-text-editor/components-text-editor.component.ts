import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

interface ITextEditorConfiguration {
  isDisabled?: boolean;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  minWidth?: string;
  width?: string;
  maxWidth?: string;
  placeholder?: string;
  clearPasteFormatting?: boolean;
  publicationDate?: Date | string | null;
}

@Component({
  selector: 'vr-components-text-editor',
  templateUrl: './components-text-editor.component.html',
  styleUrls: ['./components-text-editor.component.scss'],
})
export class ComponentsTextEditorComponent
  extends MarkdownCommon
  implements OnInit
{
  form!: FormGroup;

  config: ITextEditorConfiguration = {
    isDisabled: false,
    minHeight: '5rem',
    height: 'auto',
    maxHeight: '15rem',
    minWidth: '50%',
    width: 'auto',
    maxWidth: 'auto',
    placeholder: 'Insira o texto aqui ...',
    clearPasteFormatting: true,
    publicationDate: new Date(2022, 4, 17, 18, 30),
  };

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  toggleDisabledExample(): void {
    this.config.isDisabled = !this.config.isDisabled;
  }

  toggleclearPasteFormattingExample(): void {
    this.config.clearPasteFormatting = !this.config.clearPasteFormatting;
  }

  onChange(event: unknown): void {
    console.log('onChange', event);
  }

  onSaveEditing(event: string): void {
    console.log('onSaveEditing', event);
  }

  onCancelEditing(): void {
    console.log('onCancelEditing');
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      editor: ['<p>teste</p>', [Validators.required]],
    });
  }
}
