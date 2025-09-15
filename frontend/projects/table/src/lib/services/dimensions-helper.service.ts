import { Injectable } from '@angular/core';

/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 */
@Injectable()
export class DimensionsHelper {
  getDimensions(element: Element): DOMRect {
    return element.getBoundingClientRect();
  }

  getHeight =
    (dimensions: DOMRect) =>
    (headerHeight: number, footerHeight: number): number => {
      let height = dimensions.height;
      if (headerHeight) height = height - headerHeight;
      if (footerHeight) height = height - footerHeight;
      return height;
    };

  getHTMLFontSize(): number {
    const htmlEl = document.getElementsByTagName('html');

    if (htmlEl && htmlEl.length > 0) {
      const stringFontSize = window.getComputedStyle(htmlEl[0]).fontSize;
      return Number(stringFontSize.split('px')[0]);
    }

    return 1;
  }
}
