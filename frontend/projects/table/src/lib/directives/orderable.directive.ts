/* eslint-disable */
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  EventEmitter,
  Inject,
  KeyValueDiffers,
  Output,
} from '@angular/core';

@Directive({ selector: '[orderable]' })
export class OrderableDirective {
  @Output() reorder: EventEmitter<any> = new EventEmitter();
  @Output() targetChanged: EventEmitter<any> = new EventEmitter();

  positions: any;
  differ: any;
  lastDraggingIndex: number | undefined;

  constructor(
    differs: KeyValueDiffers,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.differ = differs.find({}).create();
  }

  isTarget(model: any, event: any): any {
    let i = 0;
    const x = event.x || event.clientX;
    const y = event.y || event.clientY;
    const targets = this.document.elementsFromPoint(x, y);

    for (const prop in this.positions) {
      // current column position which throws event.
      const pos = this.positions[prop];

      // since we drag the inner span, we need to find it in the elements at the cursor
      if (
        model.prop !== prop &&
        targets.find((el: any) => el === pos.element)
      ) {
        return {
          pos,
          i,
        };
      }

      i++;
    }
  }
}
