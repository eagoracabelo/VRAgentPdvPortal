import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'move-selected-event',
  templateUrl: './move-selected-event.component.html',
  styleUrls: ['./move-selected-event.component.scss'],
})
export class MoveSelectedEventComponent implements OnDestroy {
  private readonly event = new CustomEvent('moveSelectedEvent', {
    detail: {
      isMoveSelectedEvent: true,
    },
  });

  private readonly _subs: Subscription[] = [];

  dispatchEvent(): void {
    window.dispatchEvent(this.event);
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
