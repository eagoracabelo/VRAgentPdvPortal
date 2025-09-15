import { Injectable } from '@angular/core';

export abstract class TranslatorParser {
  abstract interpolate(expr: string, params?: unknown): string;

  abstract getValue(target: unknown, key: string): unknown | string;
}

@Injectable()
export class TranslateDefaultParser extends TranslatorParser {
  public interpolate(expr: string): string {
    return expr ?? '';
  }

  getValue(target: never, key: string): never {
    const separator = '.';
    const keys = key.split(separator);
    const newKey = keys.shift();
    if (newKey && target) {
      target = this.getValue(target[newKey], keys.join(separator));
    }
    return target;
  }
}
