import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MinionUseCase } from '../../../../core/application/use-cases/minion.use-case';
import { ActivityLog } from '../../../../core/domain/models/activity-log.model';
import { ActivityLogRepository, PageResponse } from '../../../../core/infrastructure/repositories/activity-log.repository';

@Component({
    selector: 'app-minion-management',
    templateUrl: './minion-management.component.html',
    styleUrls: ['./minion-management.component.scss']
})
export class MinionManagementComponent implements OnInit {
    minionId: string = '';

    commandForm: FormGroup;
    fileForm: FormGroup;

    private activityLogsSubject = new BehaviorSubject<ActivityLog[]>([]);
    activityLogs$ = this.activityLogsSubject.asObservable();

    loading = false;
    commandResult: any = null;

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private minionUseCase: MinionUseCase,
        private activityLogRepository: ActivityLogRepository
    ) {
        this.commandForm = this.fb.group({
            command: ['', [Validators.required]]
        });

        this.fileForm = this.fb.group({
            sourcePath: ['', [Validators.required]],
            destinationPath: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.minionId = this.route.snapshot.paramMap.get('id') || '';
        this.loadActivityLogs();
    }

    executeCommand(): void {
        if (this.commandForm.valid) {
            this.loading = true;
            const command = this.commandForm.get('command')?.value;

            this.minionUseCase.executeCommand(this.minionId, command).subscribe({
                next: (result) => {
                    this.commandResult = result;
                    this.loading = false;
                    this.commandForm.reset();
                    this.loadActivityLogs();
                },
                error: (error) => {
                    console.error('Erro ao executar comando:', error);
                    this.loading = false;
                }
            });
        }
    }

    manageFile(): void {
        if (this.fileForm.valid) {
            this.loading = true;
            const { sourcePath, destinationPath } = this.fileForm.value;

            this.minionUseCase.manageFile(this.minionId, sourcePath, destinationPath).subscribe({
                next: (result) => {
                    console.log('Arquivo gerenciado:', result);
                    this.loading = false;
                    this.fileForm.reset();
                    this.loadActivityLogs();
                },
                error: (error) => {
                    console.error('Erro ao gerenciar arquivo:', error);
                    this.loading = false;
                }
            });
        }
    }

    updateVRAgent(): void {
        this.loading = true;

        this.minionUseCase.updateVRAgent(this.minionId).subscribe({
            next: (result) => {
                console.log('VRAgent atualizado:', result);
                this.loading = false;
                this.loadActivityLogs();
            },
            error: (error) => {
                console.error('Erro ao atualizar VRAgent:', error);
                this.loading = false;
            }
        });
    }

    private loadActivityLogs(): void {
        this.activityLogRepository.getLogsByTarget(this.minionId, 0, 50).subscribe({
            next: (response: PageResponse<ActivityLog>) => {
                this.activityLogsSubject.next(response.content);
            },
            error: (error) => {
                console.error('Erro ao carregar logs:', error);
            }
        });
    }
}