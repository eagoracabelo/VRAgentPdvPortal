import { Component, Input } from '@angular/core';
import { JobDto } from '../../../core/domain/models/management.model';

type JobStatus = 'success' | 'failed' | 'running' | 'pending';

@Component({
    selector: 'app-recent-jobs',
    templateUrl: './recent-jobs.component.html',
    styleUrls: ['./recent-jobs.component.scss']
})
export class RecentJobsComponent {
    @Input() jobs: JobDto[] = [];
    @Input() maxItems: number = 10;

    getJobStatusIcon(status: string): string {
        const icons: Record<JobStatus, string> = {
            'success': 'fas fa-check-circle text-success',
            'failed': 'fas fa-times-circle text-danger',
            'running': 'fas fa-spinner fa-spin text-info',
            'pending': 'fas fa-clock text-warning'
        };

        const normalizedStatus = status.toLowerCase() as JobStatus;
        return icons[normalizedStatus] || 'fas fa-question-circle';
    }
}