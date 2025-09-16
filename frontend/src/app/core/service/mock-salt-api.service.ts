import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdminOverview, JobDto, CpuInfoDto, MemoryInfoDto, DiskInfoDto } from '../domain/models/management.model';

@Injectable({
    providedIn: 'root'
})
export class MockSaltApiService {

    getMockAdminOverview(): Observable<AdminOverview> {
        const mockData: AdminOverview = {
            minionsStatus: {
                up: ['minion-web01', 'minion-db01', 'minion-app01'],
                down: ['minion-cache01'],
                pending: []
            },
            recentJobs: [
                {
                    jid: '20241216010123456789',
                    function: 'state.apply',
                    target: 'minion-web01',
                    user: 'admin',
                    timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
                    status: 'completed'
                },
                {
                    jid: '20241216010223456789',
                    function: 'cmd.run',
                    target: '*',
                    user: 'admin',
                    timestamp: new Date(Date.now() - 600000), // 10 minutos atrás
                    status: 'failed'
                },
                {
                    jid: '20241216010323456789',
                    function: 'test.ping',
                    target: 'minion-db01',
                    user: 'system',
                    timestamp: new Date(Date.now() - 900000), // 15 minutos atrás
                    status: 'completed'
                }
            ],
            systemSummary: {
                cpu: [
                    {
                        minionId: 'minion-web01',
                        usage: 45.5,
                        loadAverage: [0.8, 0.9, 1.1],
                        cores: 4,
                        processes: 156
                    },
                    {
                        minionId: 'minion-db01',
                        usage: 72.3,
                        loadAverage: [2.1, 2.3, 2.0],
                        cores: 8,
                        processes: 198
                    }
                ],
                memory: [
                    {
                        minionId: 'minion-web01',
                        total: 8589934592, // 8GB
                        available: 3221225472, // ~3GB
                        used: 5368709120, // ~5GB
                        free: 3221225472,
                        cached: 2147483648, // 2GB
                        buffers: 536870912, // 512MB
                        swapTotal: 2147483648,
                        swapUsed: 0,
                        swapFree: 2147483648
                    },
                    {
                        minionId: 'minion-db01',
                        total: 17179869184, // 16GB
                        available: 6442450944, // ~6GB
                        used: 10737418240, // ~10GB
                        free: 6442450944,
                        cached: 4294967296, // 4GB
                        buffers: 1073741824, // 1GB
                        swapTotal: 4294967296,
                        swapUsed: 0,
                        swapFree: 4294967296
                    }
                ],
                disk: [
                    {
                        minionId: 'minion-web01',
                        mountPoint: '/',
                        filesystem: 'ext4',
                        total: 107374182400, // 100GB
                        used: 53687091200, // 50GB
                        available: 53687091200, // 50GB
                        usedPercent: 50.0
                    },
                    {
                        minionId: 'minion-db01',
                        mountPoint: '/',
                        filesystem: 'ext4',
                        total: 214748364800, // 200GB
                        used: 161061273600, // 150GB
                        available: 53687091200, // 50GB
                        usedPercent: 75.0
                    }
                ],
                processes: [
                    {
                        minionId: 'minion-web01',
                        pid: 1234,
                        name: 'nginx',
                        cpu: 5.2,
                        memory: 2.1,
                        status: 'running'
                    },
                    {
                        minionId: 'minion-db01',
                        pid: 5678,
                        name: 'postgres',
                        cpu: 15.8,
                        memory: 25.3,
                        status: 'running'
                    }
                ],
                network: [
                    {
                        minionId: 'minion-web01',
                        interface: 'eth0',
                        ip: '192.168.1.10',
                        bytesReceived: 1048576000,
                        bytesSent: 524288000,
                        packetsReceived: 1000000,
                        packetsSent: 800000
                    }
                ]
            }
        };

        // Simula delay da rede
        return of(mockData).pipe(delay(1000));
    }

    // Método para simular erro de conexão
    getMockError(): Observable<never> {
        return throwError(() => new Error('Erro de conexão simulado'));
    }

    // Alternar entre dados mock e erro
    getAdminOverview(target: string = '*', simulateError: boolean = false): Observable<AdminOverview> {
        if (simulateError) {
            return this.getMockError();
        }
        return this.getMockAdminOverview();
    }
}