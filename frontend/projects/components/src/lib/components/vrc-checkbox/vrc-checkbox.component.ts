import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Host,
  OnInit,
  Optional,
  Provider,
  SkipSelf,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';

import { getControl } from '../../shared/utils/utils';
import { VrCheckbox } from './models/vr-checkbox';

const VRC_CHECKBOX_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcCheckboxComponent),
  multi: true,
};

@Component({
  selector: 'vrc-checkbox',
  templateUrl: './vrc-checkbox.component.html',
  styleUrls: ['./vrc-checkbox.component.scss'],
  providers: [VRC_CHECKBOX_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcCheckboxComponent
  extends VrCheckbox
  implements OnInit, AfterViewChecked
{
  @ViewChild('inputCheckbox', { static: true })
  inputCheckbox!: ElementRef<HTMLInputElement>;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private readonly _controlContainer: ControlContainer,
    private readonly _cd: ChangeDetectorRef,
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
  }
}
