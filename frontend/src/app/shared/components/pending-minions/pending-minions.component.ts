import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MinionRepository } from '../../../core/infrastructure/repositories/minion.repository';
import { Minion, MinionStatus, MinionKeys } from '../../../core/domain/models/minion.model';

@Component({
    selector: 'app-pending-minions',
    templateUrl: './pending-minions.component.html',
    styleUrls: ['./pending-minions.component.scss']
})
export class PendingMinionsComponent implements OnInit, OnChanges {
    @Input() refreshTrigger: any;
    @Input() autoRefresh: boolean = true;
    @Output() operationComplete = new EventEmitter<{ operation: string, success: boolean, message: string, minionId?: string }>();

    pendingMinions: string[] = [];
    loading = false;
    error: string | null = null;
    processingMinions: Set<string> = new Set();

    constructor(private minionRepository: MinionRepository) { }

    ngOnInit(): void {
        this.loadPendingMinions();
    }

    ngOnChanges(): void {
        if (this.refreshTrigger) {
            this.loadPendingMinions();
        }
    }

    loadPendingMinions(): void {
        this.loading = true;
        this.error = null;

        // Usar o endpoint correto para listar chaves
        this.minionRepository.getAllMinions().subscribe({
            next: (keys: MinionKeys) => {
                this.pendingMinions = keys.minions_pre || [];
                this.loading = false;
                console.log('Minions pendentes carregados:', this.pendingMinions);
            },
            error: (error: any) => {
                this.error = 'Erro ao carregar minions pendentes';
                this.loading = false;
                console.error('Erro ao carregar minions:', error);
            }
        });
    }

    acceptMinion(minionId: string): void {
        if (!minionId || this.processingMinions.has(minionId)) return;

        const confirmed = confirm(`Tem certeza que deseja aceitar o minion "${minionId}"?`);
        if (!confirmed) return;

        this.processingMinions.add(minionId);
        this.error = null;

        this.minionRepository.acceptKey(minionId).subscribe({
            next: (result: any) => {
                this.processingMinions.delete(minionId);
                this.operationComplete.emit({
                    operation: 'accept',
                    success: true,
                    message: `Minion "${minionId}" aceito com sucesso`,
                    minionId: minionId
                });
                this.loadPendingMinions(); // Recarregar lista
            },
            error: (error: any) => {
                this.processingMinions.delete(minionId);
                this.error = `Erro ao aceitar minion "${minionId}": ${error || 'Erro desconhecido'}`;
                console.error('Erro ao aceitar minion:', error);
            }
        });
    }

    rejectMinion(minionId: string): void {
        if (!minionId || this.processingMinions.has(minionId)) return;

        const confirmed = confirm(`Tem certeza que deseja rejeitar o minion "${minionId}"? Esta ação pode ser revertida posteriormente.`);
        if (!confirmed) return;

        this.processingMinions.add(minionId);
        this.error = null;

        this.minionRepository.rejectKey(minionId).subscribe({
            next: (result: any) => {
                this.processingMinions.delete(minionId);
                this.operationComplete.emit({
                    operation: 'reject',
                    success: true,
                    message: `Minion "${minionId}" rejeitado com sucesso`,
                    minionId: minionId
                });
                this.loadPendingMinions(); // Recarregar lista
            },
            error: (error: any) => {
                this.processingMinions.delete(minionId);
                this.error = `Erro ao rejeitar minion "${minionId}": ${error.message || 'Erro desconhecido'}`;
                console.error('Erro ao rejeitar minion:', error);
            }
        });
    }

    denyMinion(minionId: string): void {
        if (!minionId || this.processingMinions.has(minionId)) return;

        const confirmed = confirm(`Tem certeza que deseja negar PERMANENTEMENTE o minion "${minionId}"? Esta ação NÃO pode ser revertida.`);
        if (!confirmed) return;

        this.processingMinions.add(minionId);
        this.error = null;

        this.minionRepository.denyKey(minionId).subscribe({
            next: (result: any) => {
                this.processingMinions.delete(minionId);
                this.operationComplete.emit({
                    operation: 'deny',
                    success: true,
                    message: `Minion "${minionId}" negado permanentemente`,
                    minionId: minionId
                });
                this.loadPendingMinions(); // Recarregar lista
            },
            error: (error: any) => {
                this.processingMinions.delete(minionId);
                this.error = `Erro ao negar minion "${minionId}": ${error.message || 'Erro desconhecido'}`;
                console.error('Erro ao negar minion:', error);
            }
        });
    }

    acceptAllMinions(): void {
        if (this.pendingMinions.length === 0) return;

        const confirmed = confirm(`Tem certeza que deseja aceitar TODOS os ${this.pendingMinions.length} minions pendentes?`);
        if (!confirmed) return;

        this.pendingMinions.forEach(minionId => {
            if (!this.processingMinions.has(minionId)) {
                this.acceptMinion(minionId);
            }
        });
    }

    rejectAllMinions(): void {
        if (this.pendingMinions.length === 0) return;

        const confirmed = confirm(`Tem certeza que deseja rejeitar TODOS os ${this.pendingMinions.length} minions pendentes?`);
        if (!confirmed) return;

        this.pendingMinions.forEach(minionId => {
            if (!this.processingMinions.has(minionId)) {
                this.rejectMinion(minionId);
            }
        });
    }

    isProcessing(minionId: string): boolean {
        return this.processingMinions.has(minionId);
    }

    clearError(): void {
        this.error = null;
    }

    formatMinionId(minionId: string): string {
        // Formatar ID do minion para exibição mais amigável
        return minionId.length > 20 ? minionId.substring(0, 20) + '...' : minionId;
    }

    getMinionTooltip(minionId: string): string {
        return `Minion ID: ${minionId}\nStatus: Pendente para aprovação\nClique em uma das ações para processar este minion.`;
    }

    trackByMinionId(index: number, minionId: string): string {
        return minionId;
    }
}