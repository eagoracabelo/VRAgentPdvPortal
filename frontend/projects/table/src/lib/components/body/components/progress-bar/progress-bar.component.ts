import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'table-progress',
  templateUrl: './progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {}
