import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'datatable-progress',
  templateUrl: './progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {}
