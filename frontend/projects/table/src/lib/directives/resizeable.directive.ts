/* eslint-disable */
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { filter, fromEvent, Subscription, takeUntil } from 'rxjs';

import { DimensionsHelper } from '../services/dimensions-helper.service';

@Directive({
  selector: '[resizeable]',
  host: {
    '[class.resizeable]': 'resizeEnabled',
  },
})
export class ResizeableDirective implements OnDestroy, AfterViewInit {
  @Input() resizeEnabled: boolean = true;
  @Input() minWidth!: number;
  @Input() maxWidth!: number;

  @Output() resize: EventEmitter<any> = new EventEmitter();

  element: HTMLElement;
  subscription!: Subscription;
  resizing: boolean = false;
  private resizeHandle!: HTMLElement;

  constructor(
    element: ElementRef,
    private readonly renderer: Renderer2,
    private readonly dimensionsHelper: DimensionsHelper,
  ) {
    this.element = element.nativeElement;
  }

  ngAfterViewInit(): void {
    const renderer2 = this.renderer;
    this.resizeHandle = renderer2.createElement('span');
    if (this.resizeEnabled) {
      renderer2.addClass(this.resizeHandle, 'resize-handle');
    } else {
      renderer2.addClass(this.resizeHandle, 'resize-handle--not-resizable');
    }
    renderer2.appendChild(this.element, this.resizeHandle);
  }

  ngOnDestroy(): void {
    this._destroySubscription();
    if (this.renderer.destroyNode) {
      this.renderer.destroyNode(this.resizeHandle);
    } else if (this.resizeHandle) {
      this.renderer.removeChild(
        this.renderer.parentNode(this.resizeHandle),
        this.resizeHandle,
      );
    }
  }

  onMouseup(): void {
    this.resizing = false;

    if (this.subscription && !this.subscription.closed) {
      this._destroySubscription();
      this.resize.emit(this.element.clientWidth);
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event: MouseEvent): void {
    const isHandle = (<HTMLElement>event.target).classList.contains(
      'resize-handle',
    );
    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();
    const initialWidth = this.element.clientWidth / htmlFontSize;
    const mouseDownScreenX = event.screenX / htmlFontSize;

    if (isHandle) {
      event.stopPropagation();
      this.resizing = true;

      const mouseup = fromEvent(document, 'mouseup');
      this.subscription = mouseup
        .pipe(filter((ev: any) => ev instanceof Event))
        .subscribe((_) => this.onMouseup());

      const mouseMoveSub = fromEvent(document, 'mousemove')
        .pipe(
          filter((ev: any) => ev instanceof Event),
          takeUntil(mouseup),
        )
        .subscribe((e: Event) =>
          this.move(e as MouseEvent, initialWidth, mouseDownScreenX),
        );

      this.subscription.add(mouseMoveSub);
    }
  }

  move(
    event: MouseEvent,
    initialWidth: number,
    mouseDownScreenX: number,
  ): void {
    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();
    const movementX = event.screenX / htmlFontSize - mouseDownScreenX;
    const newWidth = initialWidth + movementX;

    const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;

    if (overMinWidth && underMaxWidth) {
      this.element.style.width = `${newWidth}rem`;
    }
  }

  private _destroySubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
