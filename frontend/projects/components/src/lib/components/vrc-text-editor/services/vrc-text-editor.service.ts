import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  ITextEditorOption,
  TextEditorOption,
} from '../models/text-editor-option';

@Injectable({
  providedIn: 'root',
})
export class TextEditorService {
  constructor(@Inject(DOCUMENT) private readonly _document: Document) {}

  private _options: TextEditorOption = new TextEditorOption();
  private readonly _subjectToggleActiveButtons = new Subject<unknown>();

  get options(): TextEditorOption {
    return this._options;
  }

  get toggleActive$(): Observable<unknown> {
    return this._subjectToggleActiveButtons.asObservable();
  }

  onToggleActive(): void {
    this._subjectToggleActiveButtons.next(true);
  }

  setOptions(selectOption: ITextEditorOption): void {
    Object.assign(this._options, selectOption);
  }

  executeDocumentCommand(command: string, value?: string): void {
    this._document.execCommand(command, false, value);
  }

  getDocumentSelection(): Selection | null {
    return this._document.getSelection();
  }

  checkDocumentStateCommand(command: string): boolean {
    return this._document.queryCommandState(command);
  }

  getDocumentElementById(id: string): HTMLElement | null {
    return this._document.getElementById(id);
  }
}
