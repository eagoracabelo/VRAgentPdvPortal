import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-jobs',
  templateUrl: './recent-jobs.component.html',
  styleUrls: ['./recent-jobs.component.scss']
})
export class RecentJobsComponent {
  @Input() jobs: any[] = [];
  @Input() maxItems: number = 10;

  constructor() { }

  getDisplayJobs(): any[] {
    return this.jobs.slice(0, this.maxItems);
  }

  getJobStatusClass(success: boolean): string {
    return success ? 'success' : 'error';
  }

  getJobStatusIcon(success: boolean): string {
    return success ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  formatDateTime(timestamp: string | number): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  }

  formatDuration(start: string | number, end?: string | number): string {
    try {
      const startTime = new Date(start).getTime();
      const endTime = end ? new Date(end).getTime() : Date.now();
      const duration = endTime - startTime;
      
      if (duration < 1000) return `${duration}ms`;
      if (duration < 60000) return `${Math.round(duration / 1000)}s`;
      if (duration < 3600000) return `${Math.round(duration / 60000)}m`;
      return `${Math.round(duration / 3600000)}h`;
    } catch {
      return 'N/A';
    }
  }

  getJobTypeIcon(function_name: string): string {
    if (function_name?.includes('state')) return 'fas fa-cogs';
    if (function_name?.includes('cmd')) return 'fas fa-terminal';
    if (function_name?.includes('test')) return 'fas fa-vial';
    if (function_name?.includes('service')) return 'fas fa-play-circle';
    if (function_name?.includes('pkg')) return 'fas fa-box';
    return 'fas fa-code';
  }

  truncateFunction(function_name: string, maxLength: number = 30): string {
    if (!function_name) return 'N/A';
    return function_name.length > maxLength 
      ? function_name.substring(0, maxLength) + '...' 
      : function_name;
  }

  trackByJobId(index: number, job: any): any {
    return job.jid || job.id || index;
  }

  viewJobDetails(job: any): void {
    // Implementar navegação para detalhes do job
    console.log('View job details:', job);
  }

  rerunJob(job: any): void {
    // Implementar reexecução do job
    console.log('Rerun job:', job);
  }

  viewAllJobs(): void {
    // Implementar navegação para lista completa de jobs
    console.log('View all jobs');
  }
}