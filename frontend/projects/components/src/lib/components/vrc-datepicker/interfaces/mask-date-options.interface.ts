import { Masked } from 'imask';

export interface IMaskDateOptions {
  mask: typeof Date;
  pattern: string;
  blocks: Record<string, unknown>;
  format(value: Date | null, _?: Masked): string;
  parse(str: string): Date;
  min: Date;
  max: Date;
  autofix: boolean;
  lazy: boolean;
  overwrite: boolean;
}
