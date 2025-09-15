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

import { getControl } from '../../shared/utils/utils';
import { VrSlideToggle } from './models/vr-slide-toggle';

const VRC_SLIDE_TOGGLE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcSlideToggleComponent),
  multi: true,
};

@Component({
  selector: 'vrc-slide-toggle',
  templateUrl: './vrc-slide-toggle.component.html',
  styleUrls: ['./vrc-slide-toggle.component.scss'],
  providers: [VRC_SLIDE_TOGGLE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcSlideToggleComponent
  extends VrSlideToggle
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

  private initControl(): void {
    this.control = getControl(this._controlContainer, this.formControlName);
  }

  ngAfterViewChecked(): void {
    this._cd.detectChanges();
  }
}
