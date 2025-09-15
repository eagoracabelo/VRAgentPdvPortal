import { EventEmitter, Injectable, PipeTransform } from '@angular/core';
import { ITranslatorEventEmitter } from '../interfaces/translator-event-emitter.interface';

@Injectable()
export abstract class TranslatorPipeImpl implements PipeTransform {
  abstract get translatorChange(): EventEmitter<ITranslatorEventEmitter>;
  abstract transform(value: unknown, ...args: unknown[]): string;
}
