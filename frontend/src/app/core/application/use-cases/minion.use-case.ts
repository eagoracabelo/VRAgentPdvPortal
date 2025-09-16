import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map, tap, catchError, switchMap, startWith } from 'rxjs/operators';
import { MinionRepository } from '../../infrastructure/repositories/minion.repository';
import { MinionKeys, Minion, MinionStatus, MinionStats, CommandRequest, FileManagementRequest } from '../../domain/models/index';

@Injectable({
    providedIn: 'root'
})
export class MinionUseCase {
    private minionsSubject = new BehaviorSubject<Minion[]>([]);
    private statsSubject = new BehaviorSubject<MinionStats>({
        total: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
        denied: 0
    });
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);

    public minions$ = this.minionsSubject.asObservable();
    public stats$ = this.statsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();

    constructor(private minionRepository: MinionRepository) {
        // Auto-refresh a cada 30 segundos
        this.startAutoRefresh();
    }

    loadMinions(): Observable<Minion[]> {
        this.loadingSubject.next(true);
        this.errorSubject.next(null);

        return this.minionRepository.getAllMinions().pipe(
            map(keys => this.mapKeysToMinions(keys)),
            tap(minions => {
                this.minionsSubject.next(minions);
                this.updateStats(minions);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                this.errorSubject.next(error);
                console.error('Erro ao carregar minions:', error);
                // Retornar array vazio em caso de erro
                return [];
            })
        );
    }

    acceptMinion(keyId: string): Observable<any> {
        this.loadingSubject.next(true);

        return this.minionRepository.acceptKey(keyId).pipe(
            tap(() => {
                // Recarregar dados após aceitar minion
                this.loadMinions().subscribe();
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                this.errorSubject.next(`Erro ao aceitar minion: ${error}`);
                throw error;
            })
        );
    }

    executeCommand(minionId: string, command: string): Observable<any> {
        const commandRequest: CommandRequest = { command };
        return this.minionRepository.executeCommand(minionId, commandRequest).pipe(
            catchError(error => {
                this.errorSubject.next(`Erro ao executar comando: ${error}`);
                throw error;
            })
        );
    }

    updateVRAgent(minionId: string): Observable<any> {
        return this.minionRepository.updateVRAgentePdv(minionId).pipe(
            catchError(error => {
                this.errorSubject.next(`Erro ao atualizar VRAgent: ${error}`);
                throw error;
            })
        );
    }

    manageFile(minionId: string, sourcePath: string, destinationPath: string): Observable<any> {
        const fileRequest: FileManagementRequest = { sourcePath, destinationPath };
        return this.minionRepository.manageFile(minionId, fileRequest).pipe(
            catchError(error => {
                this.errorSubject.next(`Erro ao gerenciar arquivo: ${error}`);
                throw error;
            })
        );
    }

    clearError(): void {
        this.errorSubject.next(null);
    }

    private mapKeysToMinions(keys: MinionKeys): Minion[] {
        const minions: Minion[] = [];

        // Minions aceitos
        keys.minions.forEach(id => {
            minions.push({
                id,
                status: MinionStatus.ACCEPTED,
                lastSeen: new Date() // Placeholder - backend pode fornecer dados reais
            });
        });

        // Minions pendentes
        keys.minions_pre.forEach(id => {
            minions.push({
                id,
                status: MinionStatus.PENDING
            });
        });

        // Minions rejeitados
        keys.minions_rejected.forEach(id => {
            minions.push({
                id,
                status: MinionStatus.REJECTED
            });
        });

        // Minions negados
        keys.minions_denied.forEach(id => {
            minions.push({
                id,
                status: MinionStatus.DENIED
            });
        });

        return minions.sort((a, b) => a.id.localeCompare(b.id));
    }

    private updateStats(minions: Minion[]): void {
        const stats: MinionStats = {
            total: minions.length,
            accepted: minions.filter(m => m.status === MinionStatus.ACCEPTED).length,
            pending: minions.filter(m => m.status === MinionStatus.PENDING).length,
            rejected: minions.filter(m => m.status === MinionStatus.REJECTED).length,
            denied: minions.filter(m => m.status === MinionStatus.DENIED).length
        };

        this.statsSubject.next(stats);
    }

    private startAutoRefresh(): void {
        // Auto-refresh a cada 30 segundos
        timer(0, 30000).pipe(
            switchMap(() => this.loadMinions())
        ).subscribe();
    }
}