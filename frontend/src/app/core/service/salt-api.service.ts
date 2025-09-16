import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {
    SystemInfoDto,
    CpuInfoDto,
    MemoryInfoDto,
    DiskInfoDto,
    JobDto,
    AdminOverview
} from '../domain/models/management.model';
import {
    AppVersionResultDto,
    AppVersionListDto,
    MinionVersionInfo,
    DeploymentStatus
} from '../domain/models/app-version.model';

@Injectable({
    providedIn: 'root'
})
export class SaltApiService {
    private readonly baseUrl = '/api/salt';

    constructor(private http: HttpClient) { }

    // Status dos Minions
    getMinionsStatus(): Observable<any> {
        return this.http.get(`${this.baseUrl}/minions/status`);
    }

    pingAllMinions(): Observable<any> {
        return this.http.post(`${this.baseUrl}/minions/ping`, {});
    }

    // System Info
    getSystemInfo(target: string = '*'): Observable<SystemInfoDto[]> {
        return this.http.get<SystemInfoDto[]>(`${this.baseUrl}/system/info`, {
            params: { target }
        });
    }

    // Monitoring
    getCpuInfo(target: string = '*'): Observable<CpuInfoDto[]> {
        return this.http.get<CpuInfoDto[]>(`${this.baseUrl}/monitor/cpu`, {
            params: { target }
        });
    }

    getMemoryInfo(target: string = '*'): Observable<MemoryInfoDto[]> {
        return this.http.get<MemoryInfoDto[]>(`${this.baseUrl}/monitor/memory`, {
            params: { target }
        });
    }

    getDiskInfo(target: string = '*'): Observable<DiskInfoDto[]> {
        return this.http.get<DiskInfoDto[]>(`${this.baseUrl}/monitor/disk`, {
            params: { target }
        });
    }

    getSystemSummary(target: string = '*'): Observable<any> {
        return this.http.get(`${this.baseUrl}/monitor/summary`, {
            params: { target }
        });
    }

    // Jobs
    getJobsList(): Observable<JobDto[]> {
        return this.http.get<JobDto[]>(`${this.baseUrl}/jobs/list`);
    }

    // Admin Overview
    getAdminOverview(target: string = '*'): Observable<AdminOverview> {
        console.log(`[SaltApiService] Iniciando chamada para admin/overview com target: ${target}`);
        const startTime = Date.now();

        return this.http.get<AdminOverview>(`${this.baseUrl}/admin/overview`, {
            params: { target }
        }).pipe(
            tap(response => {
                const duration = Date.now() - startTime;
                console.log(`[SaltApiService] admin/overview respondeu em ${duration}ms`, response);
            }),
            catchError(error => {
                const duration = Date.now() - startTime;
                console.error(`[SaltApiService] admin/overview falhou após ${duration}ms`, error);
                throw error;
            })
        );
    }

    // ==================== APP VERSION MANAGEMENT ====================

    // Listar versões disponíveis
    getAvailableVersions(): Observable<AppVersionListDto> {
        console.log('[SaltApiService] Buscando versões disponíveis');
        return this.http.get<AppVersionListDto>(`${this.baseUrl}/app/versions`);
    }

    // Obter versão atual dos minions
    getCurrentVersionFromMinions(targetMinions: string = '*'): Observable<{ [key: string]: MinionVersionInfo }> {
        console.log(`[SaltApiService] Obtendo versão atual dos minions: ${targetMinions}`);
        return this.http.get<{ [key: string]: MinionVersionInfo }>(`${this.baseUrl}/app/current-version`, {
            params: { targetMinions }
        });
    }

    // Upload de nova versão
    uploadNewVersion(
        file: File,
        version: string,
        description?: string,
        targetMinions: string = '*',
        autoApply: boolean = false
    ): Observable<AppVersionResultDto> {
        console.log(`[SaltApiService] Fazendo upload da versão ${version}`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('version', version);
        if (description) formData.append('description', description);
        formData.append('targetMinions', targetMinions);
        formData.append('autoApply', autoApply.toString());

        return this.http.post<AppVersionResultDto>(`${this.baseUrl}/app/upload`, formData);
    }

    // Deploy de uma versão
    deployVersion(version: string, targetMinions: string = '*'): Observable<AppVersionResultDto> {
        console.log(`[SaltApiService] Fazendo deploy da versão ${version} para ${targetMinions}`);
        return this.http.post<AppVersionResultDto>(`${this.baseUrl}/app/${version}/deploy`, {}, {
            params: { targetMinions }
        });
    }

    // Rollback para uma versão
    rollbackToVersion(version: string, targetMinions: string = '*'): Observable<AppVersionResultDto> {
        console.log(`[SaltApiService] Fazendo rollback para versão ${version} em ${targetMinions}`);
        return this.http.post<AppVersionResultDto>(`${this.baseUrl}/app/${version}/rollback`, {}, {
            params: { targetMinions }
        });
    }

    // Testar uma versão (dry run)
    testVersion(version: string, targetMinions: string = '*'): Observable<any> {
        console.log(`[SaltApiService] Testando versão ${version} em ${targetMinions}`);
        return this.http.post(`${this.baseUrl}/app/test/${version}`, {}, {
            params: { targetMinions }
        });
    }

    // Deletar uma versão
    deleteVersion(version: string): Observable<AppVersionResultDto> {
        console.log(`[SaltApiService] Deletando versão ${version}`);
        return this.http.delete<AppVersionResultDto>(`${this.baseUrl}/app/${version}`);
    }
}