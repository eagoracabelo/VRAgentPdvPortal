import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivityLog } from '../../domain/models/activity-log.model';
import { ActivityLogRepository, PageResponse } from '../../infrastructure/repositories/activity-log.repository';

@Injectable({
    providedIn: 'root'
})
export class ActivityLogUseCase {
    private logsSubject = new BehaviorSubject<ActivityLog[]>([]);
    public logs$ = this.logsSubject.asObservable();

    constructor(private activityLogRepository: ActivityLogRepository) { }

    loadUserLogs(userId: number, page: number = 0, size: number = 20): Observable<PageResponse<ActivityLog>> {
        return this.activityLogRepository.getUserLogs(userId, page, size);
    }

    loadLogsByTarget(target: string, page: number = 0, size: number = 20): Observable<PageResponse<ActivityLog>> {
        return this.activityLogRepository.getLogsByTarget(target, page, size);
    }
}