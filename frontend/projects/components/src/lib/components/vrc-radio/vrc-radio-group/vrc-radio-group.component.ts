import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Host,
  OnInit,
  Optional,
  Provider,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getControl } from '../../../shared/utils/utils';
import { VrRadioGroup } from '../models/vr-radio-group';

const VRC_RADIO_GROUP_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcRadioGroupComponent),
  multi: true,
};

@Component({
  selector: 'vrc-radio-group',
  templateUrl: './vrc-radio-group.component.html',
  styleUrls: ['./vrc-radio-group.component.scss'],
  providers: [VRC_RADIO_GROUP_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcRadioGroupComponent
  extends VrRadioGroup
  implements OnInit, AfterViewChecked
{
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

  change(value: unknown): void {
    if (this.isDisabled) {
      return;
    }
    this.value = value;
    this.onTouched(value);
  }

  private initControl(): void {
    this.control = getControl(this._controlContainer, this.formControlName);
  }

  ngAfterViewChecked(): void {
    this._cd.detectChanges();
  }
}
