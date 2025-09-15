import { Component, Input } from '@angular/core';

@Component({
  selector: 'vrc-error-msg',
  templateUrl: './vrc-error-msg.component.html',
  styleUrls: ['./vrc-error-msg.component.scss'],
})
export class VrcErrorMsgComponent {
  @Input() message!: string | null;
  @Input() tooltipSideError = false;
  @Input() tooltipOverlay = false;
  @Input() tooltipBottomRight: boolean = true;
  @Input() tooltipBottomLeft: boolean = false;
  @Input() tooltipTopRight: boolean = false;
  @Input() tooltipTopLeft: boolean = false;
}
