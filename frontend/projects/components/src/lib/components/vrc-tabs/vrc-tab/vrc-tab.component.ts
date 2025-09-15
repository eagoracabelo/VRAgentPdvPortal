import { Component, Input } from '@angular/core';
import { Tab } from '../models/tab';

@Component({
  selector: 'vrc-tab',
  templateUrl: './vrc-tab.component.html',
})
export class VrcTabComponent implements Tab {
  @Input() label!: string;
  @Input() active = false;
  @Input() disabled = false;
  @Input() styleButton = '';
  @Input() icon = 'check_fill';
  @Input() info!: string;
  @Input() controls: string[] = [];

  containsControl(controlName: string): boolean {
    return this.controls.includes(controlName);
  }
}
