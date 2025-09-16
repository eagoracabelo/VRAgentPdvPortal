import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-performance-metrics',
  templateUrl: './performance-metrics.component.html',
  styleUrls: ['./performance-metrics.component.scss']
})
export class PerformanceMetricsComponent {
  @Input() cpuData: any[] = [];
  @Input() memoryData: any[] = [];
  @Input() diskData: any[] = [];

  constructor() { }

  getCpuUsage(): number {
    if (!this.cpuData || this.cpuData.length === 0) return 0;
    const avgUsage = this.cpuData.reduce((sum, cpu) => sum + (cpu.usage || 0), 0) / this.cpuData.length;
    return Math.round(avgUsage * 100) / 100;
  }

  getMemoryUsage(): number {
    if (!this.memoryData || this.memoryData.length === 0) return 0;
    const memory = this.memoryData[0];
    if (!memory || !memory.total || !memory.used) return 0;
    return Math.round((memory.used / memory.total) * 100 * 100) / 100;
  }

  getDiskUsage(): number {
    if (!this.diskData || this.diskData.length === 0) return 0;
    const disk = this.diskData[0];
    if (!disk || !disk.total || !disk.used) return 0;
    return Math.round((disk.used / disk.total) * 100 * 100) / 100;
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getStatusClass(percentage: number): string {
    if (percentage < 60) return 'good';
    if (percentage < 80) return 'warning';
    return 'critical';
  }
}