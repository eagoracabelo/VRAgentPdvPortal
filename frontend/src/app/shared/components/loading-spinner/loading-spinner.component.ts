import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <div class="spinner"></div>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
    styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
    @Input() message: string = 'Carregando...';
    @Input() overlay: boolean = false;
}