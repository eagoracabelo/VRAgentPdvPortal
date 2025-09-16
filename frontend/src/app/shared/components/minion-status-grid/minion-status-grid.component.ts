import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-minion-status-grid',
    templateUrl: './minion-status-grid.component.html',
    styleUrls: ['./minion-status-grid.component.scss']
})
export class MinionStatusGridComponent {
    @Input() minionsStatus: any = null;

    getOnlineCount(): number {
        return this.minionsStatus?.up?.length || 0;
    }

    getOfflineCount(): number {
        return this.minionsStatus?.down?.length || 0;
    }

    getPendingCount(): number {
        // Implementar lógica para minions pendentes se disponível
        return 0;
    }

    getTotalCount(): number {
        return this.getOnlineCount() + this.getOfflineCount() + this.getPendingCount();
    }
}