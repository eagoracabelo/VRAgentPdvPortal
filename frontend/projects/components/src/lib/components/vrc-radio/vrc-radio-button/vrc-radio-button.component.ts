import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { ITooltip } from '../../../shared/interfaces/tooltip.interface';
import { VrRadioButton } from '../models/vr-radio-button';

@Component({
  selector: 'vrc-radio-button',
  templateUrl: './vrc-radio-button.component.html',
})
export class VrcRadioButtonComponent
  extends VrRadioButton
  implements AfterViewInit
{
  @Input() tooltip!: ITooltip;

  constructor(private readonly element: ElementRef<HTMLElement>) {
    super();
  }

  ngAfterViewInit(): void {
    this.content = this.element.nativeElement?.innerHTML;
  }
}
