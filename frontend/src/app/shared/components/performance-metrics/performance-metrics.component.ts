import { Component, Input } from '@angular/core';
import { CpuInfoDto, MemoryInfoDto, DiskInfoDto } from '../../../core/domain/models/management.model';

@Component({
    selector: 'app-performance-metrics',
    templateUrl: './performance-metrics.component.html',
    styleUrls: ['./performance-metrics.component.scss']
})
export class PerformanceMetricsComponent {
    @Input() cpuData: CpuInfoDto[] = [];
    @Input() memoryData: MemoryInfoDto[] = [];
    @Input() diskData: DiskInfoDto[] = [];

    getMemoryUsagePercent(memory: MemoryInfoDto): number {
        return Math.round((memory.used / memory.total) * 100);
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}