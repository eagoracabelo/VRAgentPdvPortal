import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CommandRequest, FileManagementRequest, Minion, MinionKeys, MinionStatus } from '../../domain/models/index';
import { MinionRepository } from '../../infrastructure/repositories/minion.repository';

@Injectable({
    providedIn: 'root'
})
export class MinionUseCase {
    private minionsSubject = new BehaviorSubject<Minion[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public minions$ = this.minionsSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(private minionRepository: MinionRepository) { }

    loadMinions(): Observable<Minion[]> {
        this.loadingSubject.next(true);

        return this.minionRepository.getAllMinions().pipe(
            map(keys => this.mapKeysToMinions(keys)),
            tap(minions => {
                this.minionsSubject.next(minions);
                this.loadingSubject.next(false);
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                throw error;
            })
        );
    }

    acceptMinion(keyId: string): Observable<any> {
        this.loadingSubject.next(true);

        return this.minionRepository.acceptKey(keyId).pipe(
            tap(() => {
                this.loadMinions().subscribe();
            }),
            catchError(error => {
                this.loadingSubject.next(false);
                throw error;
            })
        );
    }

    executeCommand(minionId: string, command: string): Observable<any> {
        const commandRequest: CommandRequest = { command };
        return this.minionRepository.executeCommand(minionId, commandRequest);
    }

    updateVRAgent(minionId: string): Observable<any> {
        return this.minionRepository.updateVRAgentePdv(minionId);
    }

    manageFile(minionId: string, sourcePath: string, destinationPath: string): Observable<any> {
        const fileRequest: FileManagementRequest = { sourcePath, destinationPath };
        return this.minionRepository.manageFile(minionId, fileRequest);
    }

    private mapKeysToMinions(keys: MinionKeys): Minion[] {
        const minions: Minion[] = [];

        keys.minions.forEach(id => {
            minions.push({ id, status: MinionStatus.ACCEPTED });
        });

        keys.minions_pre.forEach(id => {
            minions.push({ id, status: MinionStatus.PENDING });
        });

        keys.minions_rejected.forEach(id => {
            minions.push({ id, status: MinionStatus.REJECTED });
        });

        keys.minions_denied.forEach(id => {
            minions.push({ id, status: MinionStatus.DENIED });
        });

        return minions.sort((a, b) => a.id.localeCompare(b.id));
    }
}