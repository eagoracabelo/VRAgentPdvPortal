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
import { VrTextarea } from './models/vr-textarea';

const VRC_TEXTAREA_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcTextareaComponent),
  multi: true,
};

@Component({
  selector: 'vrc-textarea',
  templateUrl: './vrc-textarea.component.html',
  styleUrls: ['./vrc-textarea.component.scss'],
  providers: [VRC_TEXTAREA_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcTextareaComponent
  extends VrTextarea
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
