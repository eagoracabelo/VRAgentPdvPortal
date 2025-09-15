/* eslint-disable */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 */
@Injectable()
export class ScrollbarHelper {
  private document = inject(DOCUMENT);

  width: number = this.getWidth() || 0;

  getWidth(): number {
    const outer = this.document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '6.25rem';
    (outer.style as any).msOverflowStyle = 'scrollbar';
    this.document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = this.document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
