/* eslint-disable */
import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { filter, fromEvent, Subscription, takeUntil } from 'rxjs';

import { DimensionsHelper } from '../services/dimensions-helper.service';

@Directive({ selector: '[long-press]' })
export class LongPressDirective implements OnDestroy {
  @Input() pressEnabled: boolean = true;
  @Input() pressModel: any;
  @Input() duration: number = 200;

  @Output() longPressStart: EventEmitter<any> = new EventEmitter();
  @Output() longPressing: EventEmitter<any> = new EventEmitter();
  @Output() longPressEnd: EventEmitter<any> = new EventEmitter();

  pressing!: boolean;
  isLongPressing!: boolean;
  timeout: any;
  mouseX: number = 0;
  mouseY: number = 0;
  _moveColumn = false;

  subscription!: Subscription;

  constructor(private readonly dimensionsHelper: DimensionsHelper) {}

  get press(): boolean {
    return this.pressing;
  }

  get isLongPress(): boolean {
    return this.isLongPressing;
  }

  @HostBinding('class.move-colum')
  get moveColumn(): boolean {
    if (this.blockDraggable()) {
      return false;
    }

    return this._moveColumn;
  }

  @Input()
  set isEditColumn(val: boolean) {
    this._moveColumn = val;
  }

  get isEditColumn(): boolean {
    return this._moveColumn;
  }

  blockDraggable(): boolean {
    return (
      this.pressModel?.checkboxable ||
      this.pressModel?.headerCheckboxable ||
      !this.pressModel?.draggable
    );
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.isEditColumn || this.blockDraggable()) {
      return;
    }

    // don't do right/middle clicks
    if (event.which !== 1 || !this.pressEnabled) return;

    // don't start drag if its on resize handle
    const target = <HTMLElement>event.target;
    if (target.classList.contains('resize-handle')) return;

    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();

    this.mouseX = event.clientX / htmlFontSize;
    this.mouseY = event.clientY / htmlFontSize;

    this.pressing = true;
    this.isLongPressing = false;

    const mouseup = fromEvent(document, 'mouseup');
    this.subscription = mouseup
      .pipe(filter((ev: any) => ev instanceof Event))
      .subscribe((ev: Event) => this.onMouseup());

    this.timeout = setTimeout(() => {
      this.isLongPressing = true;
      this.longPressStart.emit({
        event,
        model: this.pressModel,
      });

      this.subscription.add(
        fromEvent(document, 'mousemove')
          .pipe(
            filter((ev: any) => ev instanceof Event),
            takeUntil(mouseup),
          )
          .subscribe((event: Event) => this.onMouseMove(event as MouseEvent)),
      );

      this.loop(event);
    }, this.duration);

    this.loop(event);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.pressing && !this.isLongPressing) {
      const xThres = Math.abs(event.clientX - this.mouseX) > 10;
      const yThres = Math.abs(event.clientY - this.mouseY) > 10;

      if (xThres || yThres) {
        this.endPress();
      }
    }
  }

  loop(event: MouseEvent): void {
    if (this.isLongPressing) {
      this.timeout = setTimeout(() => {
        this.longPressing.emit({
          event,
          model: this.pressModel,
        });
        this.loop(event);
      }, 50);
    }
  }

  endPress(): void {
    clearTimeout(this.timeout);
    this.isLongPressing = false;
    this.pressing = false;
    this._destroySubscription();

    this.longPressEnd.emit({
      model: this.pressModel,
    });
  }

  onMouseup(): void {
    this.endPress();
  }

  ngOnDestroy(): void {
    this._destroySubscription();
  }

  private _destroySubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
