/* eslint-disable */
import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { DimensionsHelper } from './dimensions-helper.service';

/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 */
@Injectable({
  providedIn: 'root',
})
export class ScrollbarHelper {
  private document = inject(DOCUMENT);
  private dimensionsHelper = inject(DimensionsHelper);

  width: number = this.getWidth();

  getWidth(): number {
    if (!this.dimensionsHelper) {
      return 0;
    }

    const htmlFontSize = this.dimensionsHelper.getHTMLFontSize();

    const outer = this.document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '6.25rem';
    (outer.style as any).msOverflowStyle = 'scrollbar';
    this.document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth / htmlFontSize + 0.6 / htmlFontSize;
    outer.style.overflow = 'scroll';

    const inner = this.document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth / htmlFontSize;
    outer.parentNode?.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
