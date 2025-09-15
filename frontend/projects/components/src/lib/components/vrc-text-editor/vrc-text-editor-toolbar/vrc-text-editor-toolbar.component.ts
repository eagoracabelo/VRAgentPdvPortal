import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TextEditorService } from '../services/vrc-text-editor.service';

@Component({
  selector: 'vrc-text-editor-toolbar',
  templateUrl: './vrc-text-editor-toolbar.component.html',
  styleUrls: ['./vrc-text-editor-toolbar.component.scss'],
})
export class VrcTextEditorToolbarComponent implements OnInit, OnDestroy {
  @Input() isDisabled!: boolean;
  @Input() selectedText!: string;
  @Input() linkSelected!: boolean;
  @Input() publicationDate!: Date;
  @Output() execute: EventEmitter<string> = new EventEmitter<string>();
  @Output() openCreateLink: EventEmitter<unknown> = new EventEmitter<unknown>();
  block: string = 'p';
  private _subscriptions: Subscription[] = [];

  buttons = [
    'bold',
    'italic',
    'underline',
    'toggleCase',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    'link',
  ];

  constructor(private readonly _textEditorService: TextEditorService) {}

  ngOnInit(): void {
    this.watchToogleToolbarActive();
  }

  private watchToogleToolbarActive(): void {
    const sub = this._textEditorService.toggleActive$.subscribe(() =>
      this.toggleToolbarButtonsActiveState(),
    );
    this._subscriptions.push(sub);
  }

  toggleToolbarButtonsActiveState(): void {
    for (const button of this.buttons) {
      const result = this._textEditorService.checkDocumentStateCommand(button);
      const buttonViewReference =
        this._textEditorService.getDocumentElementById(`${button}-btn`);
      if (result) {
        buttonViewReference?.classList.add('active');
      } else {
        buttonViewReference?.classList.remove('active');
      }
    }
  }

  onInsertUrl(): void {
    this.openCreateLink.emit();
  }

  onExecute(command: string): void {
    if (!command) return;
    this.execute.emit(command);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
