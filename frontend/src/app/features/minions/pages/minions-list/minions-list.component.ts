import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Minion {
  id: string;
  status: MinionStatus;
}

export enum MinionStatus {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  REJECTED = 'rejected',
  DENIED = 'denied'
}

@Component({
  selector: 'app-minions-list',
  template: `
    <div class="minions-list" [class.compact-mode]="compact">
      <div *ngIf="minions.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-server"></i>
        </div>
        <h3>Nenhum minion encontrado</h3>
        <p>Conecte novos dispositivos para gerenciá-los aqui.</p>
      </div>

      <div *ngIf="minions.length > 0" class="minions-grid">
        <div 
          *ngFor="let minion of minions.slice(0, compact ? 5 : minions.length)" 
          class="minion-card"
          [class]="'status-' + minion.status">
          
          <div class="minion-header">
            <div class="minion-info">
              <span class="minion-id">{{ minion.id }}</span>
              <span class="minion-status" [class]="'badge-' + minion.status">
                {{ getStatusLabel(minion.status) }}
              </span>
            </div>
            
            <div class="minion-actions">
              <button 
                *ngIf="minion.status === 'pending'"
                class="btn btn-success btn-xs"
                (click)="acceptKey(minion.id)"
                title="Aceitar minion">
                <i class="fas fa-check"></i>
              </button>
              
              <button 
                *ngIf="minion.status === 'accepted'"
                class="btn btn-primary btn-xs"
                title="Gerenciar minion">
                <i class="fas fa-cog"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="compact && minions.length > 5" class="show-more">
        <button class="btn btn-outline-primary btn-sm">
          Ver mais {{ minions.length - 5 }} minions
        </button>
      </div>
    </div>
  `,
  styles: [`
    .minions-list {
      .minions-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      &.compact-mode .minions-grid {
        gap: 6px;
      }

      .minion-card {
        background: #fafafa;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        transition: all 0.2s ease;

        &:hover {
          background: #f5f5f5;
        }
      }

      .minion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .minion-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .minion-id {
        font-weight: 500;
        font-family: 'Courier New', monospace;
        color: #1a1a1a;
      }

      .minion-status {
        font-size: 0.75rem;
        padding: 2px 8px;
        border-radius: 12px;
        font-weight: 500;

        &.badge-accepted {
          background: #e8f5e8;
          color: #2e7d32;
        }

        &.badge-pending {
          background: #fff8e1;
          color: #f57c00;
        }

        &.badge-rejected {
          background: #ffebee;
          color: #c62828;
        }
      }

      .minion-actions {
        display: flex;
        gap: 4px;
      }

      .btn-xs {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          color: #ccc;
        }

        h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        p {
          margin: 0;
        }
      }

      .show-more {
        text-align: center;
        margin-top: 16px;
      }
    }
  `]
})
export class MinionsListComponent {
  @Input() minions: Minion[] = [];
  @Input() compact: boolean = false;
  @Output() onAcceptKey = new EventEmitter<string>();
  @Output() onRefresh = new EventEmitter<void>();

  getStatusLabel(status: MinionStatus): string {
    const labels = {
      [MinionStatus.ACCEPTED]: 'Aceito',
      [MinionStatus.PENDING]: 'Pendente',
      [MinionStatus.REJECTED]: 'Rejeitado',
      [MinionStatus.DENIED]: 'Negado'
    };
    return labels[status] || 'Desconhecido';
  }

  acceptKey(keyId: string): void {
    this.onAcceptKey.emit(keyId);
  }

  refresh(): void {
    this.onRefresh.emit();
  }
}