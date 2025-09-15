import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslatorPipeImpl } from './../../../../shared/classes/translator-pipe';
import { ETokens } from './../../../../shared/enums/tokens.enum';
import { IShortcut } from './../interfaces/shortcut.interface';

@Pipe({
  name: 'filterShortcut',
})
export class FilterShortcutPipe implements PipeTransform {
  constructor(
    @Inject(ETokens.TRANSLATOR_TOKEN)
    protected readonly _translatorPipe: TranslatorPipeImpl,
  ) {}

  transform(shortcuts: IShortcut[], filter: string): IShortcut[] {
    this.translateLabel(shortcuts);
    return shortcuts.filter((shortcut: IShortcut) => {
      const formattedKeys = this.formatKey(shortcut.keys);
      const translated = this.replaceAccentAndToLowerCase(
        `${formattedKeys}${shortcut.label}`,
      );

      const filterReplaceAccent = this.replaceAccentAndToLowerCase(filter);

      return translated.indexOf(filterReplaceAccent) !== -1;
    });
  }

  private replaceAccentAndToLowerCase(value: string): string {
    return value
      .normalize('NFD')
      ?.replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private formatKey(keys: string[]): string {
    let value = '';

    for (const [index, key] of keys.entries()) {
      value += `${key} `;
      if (index !== keys.length - 1) {
        value += `+ `;
      }
    }

    return value;
  }

  private translateLabel(shortcuts: IShortcut[]): void {
    for (const shortcut of shortcuts) {
      shortcut.label = this._translatorPipe.transform(shortcut.label);
    }
  }
}
