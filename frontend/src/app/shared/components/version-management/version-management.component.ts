import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SaltApiService } from '../../../core/service/salt-api.service';
import {
    AppVersionListDto,
    AppVersionResultDto,
    MinionVersionInfo,
    AppVersionInfo
} from '../../../core/domain/models/app-version.model';

@Component({
    selector: 'app-version-management',
    templateUrl: './version-management.component.html',
    styleUrls: ['./version-management.component.scss']
})
export class VersionManagementComponent implements OnInit {
    @Input() selectedMinions: string = '*';
    @Output() operationComplete = new EventEmitter<{ operation: string, success: boolean, message: string }>();

    // Estados
    loading = false;
    error: string | null = null;

    // Dados
    availableVersions: AppVersionInfo[] = [];
    currentVersions: { [key: string]: MinionVersionInfo } = {};

    // Upload
    selectedFile: File | null = null;
    newVersionNumber = '';
    versionDescription = '';
    autoApply = false;

    // Deploy/Rollback
    selectedVersionForDeploy = '';
    deploymentInProgress = false;

    constructor(private saltApiService: SaltApiService) { }

    ngOnInit(): void {
        this.loadVersionData();
    }

    loadVersionData(): void {
        this.loading = true;
        this.error = null;

        // Carregar versões disponíveis e versões atuais em paralelo
        Promise.all([
            this.saltApiService.getAvailableVersions().toPromise(),
            this.saltApiService.getCurrentVersionFromMinions(this.selectedMinions).toPromise()
        ]).then(([versions, currentVersions]) => {
            this.availableVersions = versions?.versions || [];
            this.currentVersions = currentVersions || {};
        }).catch(error => {
            this.error = 'Erro ao carregar dados de versão';
            console.error('Erro ao carregar versões:', error);
        }).finally(() => {
            this.loading = false;
        });
    }

    onFileSelected(event: any): void {
        const file = event.target.files?.[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    uploadNewVersion(): void {
        if (!this.selectedFile || !this.newVersionNumber.trim()) {
            this.error = 'Selecione um arquivo e informe o número da versão';
            return;
        }

        this.loading = true;
        this.error = null;

        this.saltApiService.uploadNewVersion(
            this.selectedFile,
            this.newVersionNumber.trim(),
            this.versionDescription.trim() || undefined,
            this.selectedMinions,
            this.autoApply
        ).pipe(
            finalize(() => this.loading = false)
        ).subscribe({
            next: (result: AppVersionResultDto) => {
                if (result.success) {
                    this.operationComplete.emit({
                        operation: 'upload',
                        success: true,
                        message: `Versão ${this.newVersionNumber} enviada com sucesso`
                    });
                    this.resetUploadForm();
                    this.loadVersionData(); // Recarregar dados
                } else {
                    this.error = result.message || 'Erro ao fazer upload da versão';
                }
            },
            error: (error: any) => {
                this.error = 'Erro ao fazer upload: ' + (error.message || 'Erro desconhecido');
                console.error('Erro no upload:', error);
            }
        });
    }

    deployVersion(version: string): void {
        if (!version) return;

        this.deploymentInProgress = true;
        this.error = null;

        this.saltApiService.deployVersion(version, this.selectedMinions).pipe(
            finalize(() => this.deploymentInProgress = false)
        ).subscribe({
            next: (result: AppVersionResultDto) => {
                if (result.success) {
                    this.operationComplete.emit({
                        operation: 'deploy',
                        success: true,
                        message: `Deploy da versão ${version} iniciado com sucesso`
                    });
                    this.loadVersionData(); // Recarregar dados
                } else {
                    this.error = result.message || 'Erro ao fazer deploy da versão';
                }
            },
            error: (error: any) => {
                this.error = 'Erro no deploy: ' + (error.message || 'Erro desconhecido');
                console.error('Erro no deploy:', error);
            }
        });
    }

    rollbackToVersion(version: string): void {
        if (!version) return;

        const confirmed = confirm(`Tem certeza que deseja fazer rollback para a versão ${version}?`);
        if (!confirmed) return;

        this.deploymentInProgress = true;
        this.error = null;

        this.saltApiService.rollbackToVersion(version, this.selectedMinions).pipe(
            finalize(() => this.deploymentInProgress = false)
        ).subscribe({
            next: (result: AppVersionResultDto) => {
                if (result.success) {
                    this.operationComplete.emit({
                        operation: 'rollback',
                        success: true,
                        message: `Rollback para versão ${version} iniciado com sucesso`
                    });
                    this.loadVersionData(); // Recarregar dados
                } else {
                    this.error = result.message || 'Erro ao fazer rollback';
                }
            },
            error: (error: any) => {
                this.error = 'Erro no rollback: ' + (error.message || 'Erro desconhecido');
                console.error('Erro no rollback:', error);
            }
        });
    }

    testVersion(version: string): void {
        if (!version) return;

        this.loading = true;
        this.error = null;

        this.saltApiService.testVersion(version, this.selectedMinions).pipe(
            finalize(() => this.loading = false)
        ).subscribe({
            next: (result: any) => {
                console.log('Resultado do teste:', result);
                this.operationComplete.emit({
                    operation: 'test',
                    success: true,
                    message: `Teste da versão ${version} executado - verifique os logs`
                });
            },
            error: (error: any) => {
                this.error = 'Erro no teste: ' + (error.message || 'Erro desconhecido');
                console.error('Erro no teste:', error);
            }
        });
    }

    deleteVersion(version: string): void {
        if (!version) return;

        const confirmed = confirm(`Tem certeza que deseja deletar a versão ${version}? Esta ação não pode ser desfeita.`);
        if (!confirmed) return;

        this.loading = true;
        this.error = null;

        this.saltApiService.deleteVersion(version).pipe(
            finalize(() => this.loading = false)
        ).subscribe({
            next: (result: AppVersionResultDto) => {
                if (result.success) {
                    this.operationComplete.emit({
                        operation: 'delete',
                        success: true,
                        message: `Versão ${version} deletada com sucesso`
                    });
                    this.loadVersionData(); // Recarregar dados
                } else {
                    this.error = result.message || 'Erro ao deletar versão';
                }
            },
            error: (error: any) => {
                this.error = 'Erro ao deletar: ' + (error.message || 'Erro desconhecido');
                console.error('Erro ao deletar:', error);
            }
        });
    }

    resetUploadForm(): void {
        this.selectedFile = null;
        this.newVersionNumber = '';
        this.versionDescription = '';
        this.autoApply = false;
        // Reset file input
        const fileInput = document.getElementById('versionFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    clearError(): void {
        this.error = null;
    }

    getCurrentVersionForMinion(minionId: string): string {
        return this.currentVersions[minionId]?.currentVersion || 'Desconhecida';
    }

    getMinionStatus(minionId: string): string {
        return this.currentVersions[minionId]?.status || 'UNKNOWN';
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'ONLINE': return 'status-online';
            case 'OFFLINE': return 'status-offline';
            default: return 'status-unknown';
        }
    }

    getVersionStatusClass(status: string): string {
        switch (status) {
            case 'DEPLOYED': return 'version-deployed';
            case 'AVAILABLE': return 'version-available';
            case 'DEPRECATED': return 'version-deprecated';
            default: return 'version-unknown';
        }
    }

    // Método auxiliar para usar Object.keys no template
    getObjectKeys(obj: any): string[] {
        return Object.keys(obj || {});
    } formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString: string): string {
        try {
            return new Date(dateString).toLocaleString('pt-BR');
        } catch {
            return dateString;
        }
    }
}