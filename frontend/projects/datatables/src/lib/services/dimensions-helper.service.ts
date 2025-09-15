import { Injectable } from '@angular/core';

/**
 * Gets the width of the scrollbar.  Nesc for windows
 * http://stackoverflow.com/a/13382873/888165
 */
@Injectable({
  providedIn: 'root',
})
export class DimensionsHelper {
  private fontSize!: number;

  getDimensions(element: Element): DOMRect {
    return element.getBoundingClientRect();
  }

  getHeight =
    (dimensions: DOMRect) =>
    (headerHeight: number, footerHeight: number): number => {
      let height = dimensions.height / this.getHTMLFontSize();
      if (headerHeight) height = height - headerHeight;
      if (footerHeight) height = height - footerHeight;
      return height;
    };

  getHTMLFontSize(): number {
    if (this.fontSize) {
      return this.fontSize;
    }

    const htmlEl = document.getElementsByTagName('html');

    if (htmlEl && htmlEl.length > 0) {
      const stringFontSize = window.getComputedStyle(htmlEl[0]).fontSize;
      this.fontSize = Number(stringFontSize.split('px')[0]);
    }

    return 16;
  }

  getToolsHeight(element: Element): number {
    const toolsEl = element.querySelector('datatable-tools');
    return toolsEl ? toolsEl.clientHeight : 50;
  }
}
