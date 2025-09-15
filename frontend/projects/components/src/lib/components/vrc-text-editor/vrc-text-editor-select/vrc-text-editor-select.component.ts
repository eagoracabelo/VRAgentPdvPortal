import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  OnInit,
  Output,
  Provider,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { VrSelectField } from '../../../shared/vr-element-field/vr-select-field';
import { TextEditorSelectOption } from '../interfaces/text-editor-select-option.interface';

export const CUSTOM_TEXT_EDITOR_SELECT_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcTextEditorSelectComponent),
  multi: true,
};

@Component({
  selector: 'vrc-text-editor-select',
  templateUrl: './vrc-text-editor-select.component.html',
  styleUrls: ['./vrc-text-editor-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CUSTOM_TEXT_EDITOR_SELECT_CONTROL_VALUE_ACCESSOR],
})
export class VrcTextEditorSelectComponent
  extends VrSelectField
  implements OnInit, ControlValueAccessor
{
  // eslint-disable-next-line @angular-eslint/no-output-rename, @angular-eslint/no-output-native
  @Output('change') changeEvent = new EventEmitter();
  @ViewChild('labelButton', { static: true }) labelButton!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClick(): void {
    this.close();
  }

  selectedOption!: TextEditorSelectOption;
  opened: boolean = false;
  options: TextEditorSelectOption[] = [
    {
      label: 'Parágrafo',
      value: 'p',
    },
    {
      label: 'Título',
      value: 'h1',
    },
    {
      label: 'Subtítulo',
      value: 'h2',
    },
  ];

  override get value(): string {
    return this.selectedOption.value;
  }

  override set value(value: string) {
    const selectedElement = this.options.find((el) => el.value === value);

    if (!value || typeof value !== 'string' || !selectedElement) return;

    this.selectedOption = selectedElement;
  }

  get isOpen(): boolean {
    return this.opened;
  }

  constructor(private readonly elRef: ElementRef) {
    super();
  }

  override ngOnInit(): void {
    this.initSelectedOption();
  }

  initSelectedOption(): void {
    this.selectedOption = this.options[0];
  }

  toggleOpen(event: MouseEvent): void {
    event.stopPropagation();
    this.opened = !this.opened;
  }

  close(): void {
    this.opened = false;
  }

  override writeValue(value: string): void {
    this.value = value;
  }

  override registerOnChange(fn: VoidFunction): void {
    this.onChange = fn;
  }

  override registerOnTouched(fn: VoidFunction): void {
    this.onTouched = fn;
  }

  optionSelect(option: TextEditorSelectOption, event: MouseEvent): void {
    event.stopPropagation();
    this.value = option.value;
    this.onChange(this.value);
    this.changeEvent.emit(this.value);
    this.onTouched();
    this.opened = false;
  }
}
