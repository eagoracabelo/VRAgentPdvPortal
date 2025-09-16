import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

export interface NotificationMessage {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number; // Duração em millisegundos, 0 = manual
}

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnChanges {
    @Input() notification: NotificationMessage | null = null;
    @Output() close = new EventEmitter<void>();

    private autoCloseTimeout?: number;

    ngOnChanges(): void {
        if (this.notification && this.notification.duration && this.notification.duration > 0) {
            this.autoCloseTimeout = window.setTimeout(() => {
                this.onClose();
            }, this.notification.duration);
        }
    }

    onClose(): void {
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
        }
        this.close.emit();
    }

    getIconClass(): string {
        switch (this.notification?.type) {
            case 'success': return 'fas fa-check-circle';
            case 'error': return 'fas fa-exclamation-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'info': return 'fas fa-info-circle';
            default: return 'fas fa-info-circle';
        }
    }

    getAlertClass(): string {
        switch (this.notification?.type) {
            case 'success': return 'alert-success';
            case 'error': return 'alert-danger';
            case 'warning': return 'alert-warning';
            case 'info': return 'alert-info';
            default: return 'alert-info';
        }
    }
}