import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerformanceMetricsComponent } from './components/performance-metrics/performance-metrics.component';
import { RecentJobsComponent } from './components/recenet-jobs/recent-jobs.component';
import { MinionStatusGridComponent } from './components/minion-status-grid/minion-status-grid.component';
import { VersionManagementComponent } from './components/version-management/version-management.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PendingMinionsComponent } from './components/pending-minions/pending-minions.component';
import { MinionSystemInfoComponent } from './components/minion-system-info/minion-system-info.component';

@NgModule({
    declarations: [
        PerformanceMetricsComponent,
        RecentJobsComponent,
        MinionStatusGridComponent,
        VersionManagementComponent,
        NotificationComponent,
        PendingMinionsComponent,
        MinionSystemInfoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PerformanceMetricsComponent,
        RecentJobsComponent,
        MinionStatusGridComponent,
        VersionManagementComponent,
        NotificationComponent,
        PendingMinionsComponent,
        MinionSystemInfoComponent
    ]
})
export class SharedModule { }