import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    SystemInfoDto,
    CpuInfoDto,
    MemoryInfoDto,
    DiskInfoDto,
    JobDto,
    AdminOverview
} from '../domain/models/management.model';

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
        return this.http.get<AdminOverview>(`${this.baseUrl}/admin/overview`, {
            params: { target }
        });
    }
}