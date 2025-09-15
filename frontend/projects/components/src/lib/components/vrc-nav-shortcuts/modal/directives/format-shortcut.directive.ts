import { Directive, ElementRef, Input } from '@angular/core';
import { IShortcut } from '../interfaces/shortcut.interface';

@Directive({
  selector: '[vrFormatShortcut]',
})
export class FormatShortcutDirective {
  @Input() set shortcut(value: IShortcut) {
    const formatted = this.formatKey(value.keys);
    this.el.nativeElement.innerHTML = `${formatted}${value.label}`;
  }

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  private formatKey(keys: string[]): string {
    let htmlValue = '';

    for (const [index, key] of keys.entries()) {
      htmlValue += `<span>${key}</span> `;
      if (index !== keys.length - 1) {
        htmlValue += `+ `;
      }
    }

    return htmlValue;
  }
}
