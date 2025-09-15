import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { VrcThemeService } from '@vrsoftbr/vr-components';
import {
  Editor,
  EditorConfiguration,
  EditorFromTextArea,
  fromTextArea,
} from 'codemirror';
import { Subscription } from 'rxjs';

enum ThemeEditor {
  Dark = 'darcula',
  Light = 'eclipse',
}

@Component({
  selector: 'vr-code-mirror',
  templateUrl: './code-mirror.component.html',
  styleUrls: ['./code-mirror.component.scss'],
})
export class CodeMirrorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('codeMirrorEditor')
  codeMirrorEditor!: ElementRef<HTMLTextAreaElement>;

  @Input() mode = 'text/html';
  @Input() lineWrapping = true;
  @Input() lineNumbers = true;
  @Input() width = null;
  @Input() height = 500;
  @Input() value!: string;

  @Output() emitValue!: EventEmitter<string>;

  private editor!: EditorFromTextArea;
  private _timeout!: number;
  private timer?: ReturnType<typeof setTimeout>;
  private sub!: Subscription;

  constructor(private themeServ: VrcThemeService) {
    this.emitValue = new EventEmitter<string>();
    this._timeout = 1000;
  }

  set timeout(v: number) {
    this._timeout = v;
  }

  private get options(): EditorConfiguration {
    return {
      mode: this.mode,
      lineWrapping: this.lineWrapping,
      lineNumbers: this.lineNumbers,
      readOnly: true,
      className: 'readOnly',
    } as EditorConfiguration;
  }

  private get codeMirrorElement(): HTMLTextAreaElement {
    return this.codeMirrorEditor.nativeElement;
  }

  ngAfterViewInit(): void {
    this.editorInit();
  }

  private editorInit(): void {
    this.editor = fromTextArea(this.codeMirrorElement, this.options);
    this.setThemeEditor();
    this.setValues();
    this.setSize();
    this.onChange();
  }

  private setThemeEditor(): void {
    this.sub = this.themeServ.theme.subscribe((theme: string) => {
      const currentTheme =
        theme === 'dark' ? ThemeEditor.Dark : ThemeEditor.Light;
      this.editor.setOption('theme', currentTheme);
    });
  }

  private setValues(value = this.value): void {
    this.editor.setValue(value);
  }

  setSize(width = this.width, height = this.height): void {
    this.editor.setSize(width, height);
  }

  private onChange(): void {
    this.editor.on('change', (code: Editor) => {
      const value = code.getValue();
      this.debounceTime(value);
    });
  }

  private debounceTime(value: string): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.timer = setTimeout(() => {
      this.emitValue.emit(value);
    }, this._timeout);
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
