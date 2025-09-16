import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerformanceMetricsComponent } from './components/performance-metrics/performance-metrics.component';
import { RecentJobsComponent } from './components/recenet-jobs/recent-jobs.component';
import { MinionStatusGridComponent } from './components/minion-status-grid/minion-status-grid.component';

@NgModule({
    declarations: [
        PerformanceMetricsComponent,
        RecentJobsComponent,
        MinionStatusGridComponent
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
        MinionStatusGridComponent
    ]
})
export class SharedModule { }