import { Component, Input } from '@angular/core';
import { MinionStatus } from '../../../core/domain/models/minion.model';

@Component({
    selector: 'app-status-badge',
    template: `
    <span class="status-badge" [class]="getStatusClass()">
      <i [class]="getStatusIcon()"></i>
      {{ getStatusLabel() }}
    </span>
  `,
    styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
    @Input() status!: MinionStatus;

    getStatusClass(): string {
        const classes = {
            [MinionStatus.ACCEPTED]: 'status-accepted',
            [MinionStatus.PENDING]: 'status-pending',
            [MinionStatus.REJECTED]: 'status-rejected',
            [MinionStatus.DENIED]: 'status-denied'
        };
        return classes[this.status] || '';
    }

    getStatusIcon(): string {
        const icons = {
            [MinionStatus.ACCEPTED]: 'fas fa-check-circle',
            [MinionStatus.PENDING]: 'fas fa-clock',
            [MinionStatus.REJECTED]: 'fas fa-times-circle',
            [MinionStatus.DENIED]: 'fas fa-ban'
        };
        return icons[this.status] || 'fas fa-question-circle';
    }

    getStatusLabel(): string {
        const labels = {
            [MinionStatus.ACCEPTED]: 'Aceito',
            [MinionStatus.PENDING]: 'Pendente',
            [MinionStatus.REJECTED]: 'Rejeitado',
            [MinionStatus.DENIED]: 'Negado'
        };
        return labels[this.status] || 'Desconhecido';
    }
}