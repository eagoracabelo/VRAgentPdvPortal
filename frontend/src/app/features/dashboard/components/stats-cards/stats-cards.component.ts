import { Component, Input } from '@angular/core';

export interface DashboardStats {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
    denied: number;
}

@Component({
    selector: 'app-stats-cards',
    templateUrl: './stats-cards.component.html',
    styleUrls: ['./stats-cards.component.scss']
})
export class StatsCardsComponent {
    @Input() stats: DashboardStats = {
        total: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
        denied: 0
    };
}