import { Component, Input } from '@angular/core';

@Component({
  selector: 'vrc-form-debug',
  templateUrl: './form-debug.component.html',
})
export class FormDebugComponent {
  @Input() form: unknown;
}
