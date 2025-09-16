import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-minion-status-grid',
  templateUrl: './minion-status-grid.component.html',
  styleUrls: ['./minion-status-grid.component.scss']
})
export class MinionStatusGridComponent {
  @Input() minionsStatus: any = {};
  
  constructor() { }

  getMinionsUp(): string[] {
    return this.minionsStatus?.up || [];
  }

  getMinionsDown(): string[] {
    return this.minionsStatus?.down || [];
  }

  getTotalMinions(): number {
    return this.getMinionsUp().length + this.getMinionsDown().length;
  }

  getUpPercentage(): number {
    const total = this.getTotalMinions();
    return total > 0 ? (this.getMinionsUp().length / total) * 100 : 0;
  }
}