import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Minion, MinionStatus } from '../../../../core/domain/models/minion.model';

@Component({
    selector: 'app-minion-card',
    templateUrl: './minion-card.component.html',
    styleUrls: ['./minion-card.component.scss']
})
export class MinionCardComponent {
    @Input() minion!: Minion;
    @Output() onAccept = new EventEmitter<string>();
    @Output() onManage = new EventEmitter<Minion>();

    readonly MinionStatus = MinionStatus;

    acceptMinion(): void {
        this.onAccept.emit(this.minion.id);
    }

    manageMinion(): void {
        this.onManage.emit(this.minion);
    }
}