import IMask, { Masked } from 'imask';

export const imaskDateOptions: Record<string, unknown> = {
  mask: Date,
  pattern: 'd{/}m{/}Y',
  blocks: {
    d: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 99,
      maxLength: 2,
    },
    m: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 99,
      maxLength: 2,
    },
    Y: {
      mask: IMask.MaskedRange,
      from: 1000,
      to: 9999,
      maxLength: 4,
      minLength: 2,
      autofix: false,
      overwrite: false,
    },
  },
  format(value: Date | null, _?: Masked): string {
    if (!value) return '';
    const padNumber = (n: number): string => n.toString().padStart(2, '0');
    const day = padNumber(value.getDate());
    const month = padNumber(value.getMonth() + 1);
    const year = value.getFullYear();
    return [day, month, year].join('/');
  },
  parse(str: string): Date {
    const daymonthyear = str.split('/');
    const day = +daymonthyear[0];
    const month = +daymonthyear[1];
    let year = +daymonthyear[2];
    year = year < 90 ? 2000 + year : year;
    return new Date(year, month - 1, day);
  },
  min: new Date(1970, 0, 1),
  max: new Date(2099, 12, 31),
  autofix: false,
  lazy: true,
  overwrite: false,
};

export default imaskDateOptions;
