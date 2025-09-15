import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityLog } from '../../domain/models/activity-log.model';

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

@Injectable({
    providedIn: 'root'
})
export class ActivityLogRepository {
    private readonly baseUrl = '/api/activity-logs';

    constructor(private http: HttpClient) { }

    getUserLogs(userId: number, page: number = 0, size: number = 20): Observable<PageResponse<ActivityLog>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<ActivityLog>>(`${this.baseUrl}/user/${userId}`, { params });
    }

    getLogsByAction(action: string, page: number = 0, size: number = 20): Observable<PageResponse<ActivityLog>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<ActivityLog>>(`${this.baseUrl}/action/${action}`, { params });
    }

    getLogsByTarget(target: string, page: number = 0, size: number = 20): Observable<PageResponse<ActivityLog>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<ActivityLog>>(`${this.baseUrl}/target/${target}`, { params });
    }

    getLogsByDateRange(startDate: Date, endDate: Date, page: number = 0, size: number = 20): Observable<PageResponse<ActivityLog>> {
        const params = new HttpParams()
            .set('startDate', startDate.toISOString())
            .set('endDate', endDate.toISOString())
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PageResponse<ActivityLog>>(`${this.baseUrl}/date-range`, { params });
    }
}