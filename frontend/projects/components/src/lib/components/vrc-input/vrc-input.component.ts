import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Provider,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getControl } from '../../shared/utils/utils';
import { VrInput } from './models/vr-input';

const VRC_INPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcInputComponent),
  multi: true,
};

@Component({
  selector: 'vrc-input',
  templateUrl: './vrc-input.component.html',
  styleUrls: ['./vrc-input.component.scss'],
  providers: [VRC_INPUT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcInputComponent
  extends VrInput
  implements OnInit, AfterViewChecked
{
  @Input() set currency(value: string) {
    if (!value) return;

    this.rtl = true;
    this.mask = {
      mask: `${value} num`,
      blocks: {
        num: {
          mask: String,
        },
      },
    };
  }

  @Input() rtl!: boolean;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private readonly _controlContainer: ControlContainer,
    private readonly _cd: ChangeDetectorRef,
    protected elementRef: ElementRef,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.initControl();
    super.ngOnInit();
  }

  private initControl(): void {
    this.control = getControl(this._controlContainer, this.formControlName);
  }

  ngAfterViewChecked(): void {
    this._cd.detectChanges();
    this.verifyHasValue();
    this.formatInput();
  }

  validateNumber(e: { keyCode: number; preventDefault: () => void }): void {
    const isValidKey = e.keyCode >= 48 && e.keyCode <= 57;
    const isBackspace = e.keyCode === 8;

    if (this.rtl && !isValidKey && !isBackspace) e.preventDefault();
  }

  formatInput(): void {
    if (!this.rtl || String(this.value).length < 1) return;

    const numberOnly = Number(String(this.value)?.replace(/\D+/g, ''));
    const formattedString = String(numberOnly).padStart(3, '0');

    const formattedValue = formattedString?.replace(/(\d{2})$/g, ',$1');
    const [integers, decimal] = formattedValue.split(',');

    const formattedIntegers = integers
      .split('')
      .reverse()
      .join('')
      ?.replace(/(\d{3})/g, '$1.')
      .split('')
      .reverse()
      .join('')
      ?.replace(/^\./, '');

    this.value = `${formattedIntegers},${decimal}`;
  }
}
