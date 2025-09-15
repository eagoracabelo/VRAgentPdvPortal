import {
  AfterContentInit,
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
import { VrAutocomplete } from './models/vr-autocomplete';

const VRC_AUTOCOMPLETE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VrcAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'vrc-autocomplete',
  templateUrl: './vrc-autocomplete.component.html',
  styleUrls: ['./vrc-autocomplete.component.scss'],
  providers: [VRC_AUTOCOMPLETE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcAutocompleteComponent
  extends VrAutocomplete
  implements OnInit, AfterContentInit, AfterViewChecked
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

  ngAfterContentInit(): void {
    this.isCurrentInit();
  }

  ngAfterViewChecked(): void {
    this._cd.detectChanges();
  }
}
