/* eslint-disable */
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { filter, fromEvent, Subscription, takeUntil } from 'rxjs';

import { DimensionsHelper } from '../services/dimensions-helper.service';

/**
 * Draggable Directive for Angular2
 *
 * Inspiration:
 *   https://github.com/AngularClass/angular2-examples/blob/master/rx-draggable/directives/draggable.ts
 *   http://stackoverflow.com/questions/35662530/how-to-implement-drag-and-drop-in-angular2
 *
 */
@Directive({ selector: '[draggable]' })
export class DraggableDirective implements OnDestroy, OnChanges {
  @Input() dragEventTarget: any;
  @Input() dragModel: any;
  @Input() dragX: boolean = true;
  @Input() dragY: boolean = true;

  @Output() dragStart: EventEmitter<any> = new EventEmitter();
  @Output() dragging: EventEmitter<any> = new EventEmitter();
  @Output() dragEnd: EventEmitter<any> = new EventEmitter();

  @Input()
  set isEditColumn(val: boolean) {
    this._moveColumn = val;
  }

  get isEditColumn(): boolean {
    return this._moveColumn;
  }

  element: HTMLElement;
  isDragging: boolean = false;
  subscription!: Subscription;
  _moveColumn = false;

  constructor(
    element: ElementRef,
    private readonly dimensionsHelper: DimensionsHelper,
  ) {
    this.element = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['dragEventTarget'] &&
      changes['dragEventTarget'].currentValue &&
      this.dragModel.dragging &&
      this.isEditColumn
    ) {
      this.onMousedown(changes['dragEventTarget'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this._destroySubscription();
  }

  onMouseup(event: MouseEvent): void {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.element.classList.remove('dragging');

    if (this.subscription) {
      this._destroySubscription();
      this.dragEnd.emit({
        event,
        element: this.element,
        model: this.dragModel,
      });
    }
  }

  onMousedown(event: MouseEvent): void {
    // we only want to drag the inner header text
    const isDragElm = (<HTMLElement>event.target).classList.contains(
      'draggable',
    );

    if (isDragElm && (this.dragX || this.dragY)) {
      event.preventDefault();
      this.isDragging = true;

      const mouseDownPos = { x: event.clientX, y: event.clientY };

      const mouseup = fromEvent(document, 'mouseup');
      this.subscription = mouseup
        .pipe(filter((ev: any) => ev instanceof Event))
        .subscribe((ev: Event) => this.onMouseup(ev as MouseEvent));

      const mouseMoveSub = fromEvent(document, 'mousemove')
        .pipe(
          filter((ev: any) => ev instanceof Event),
          takeUntil(mouseup),
        )
        .subscribe((ev: Event) => this.move(ev as MouseEvent, mouseDownPos));

      this.subscription.add(mouseMoveSub);

      this.dragStart.emit({
        event,
        element: this.element,
        model: this.dragModel,
      });
    }
  }

  move(event: MouseEvent, mouseDownPos: { x: number; y: number }): void {
    if (!this.isDragging) return;

    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();

    const x = (event.clientX - mouseDownPos.x) / htmlFontSize;
    const y = (event.clientY - mouseDownPos.y) / htmlFontSize;

    if (this.dragX) this.element.style.left = `${x}rem`;
    if (this.dragY) this.element.style.top = `${y}rem`;

    this.element.classList.add('dragging');

    this.dragging.emit({
      event,
      element: this.element,
      model: this.dragModel,
    });
  }

  private _destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
