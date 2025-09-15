import IMask from 'imask';

export const imaskDateMonthOptions = {
  mask: Date,
  pattern: 'm{/}Y',
  blocks: {
    d: {
      mask: IMask.MaskedRange,
      maxLength: 2,
      from: 1,
      to: 99,
    },
    m: {
      mask: IMask.MaskedRange,
      maxLength: 2,
      from: 1,
      to: 99,
    },
    Y: {
      mask: IMask.MaskedRange,
      from: 1000,
      to: 9999,
      overwrite: false,
      minLength: 2,
      autofix: false,
      maxLength: 4,
    },
  },
  format(date: Date): string {
    const padNumber = (n: number): string => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    return [month, year].join('/');
  },
  parse(str: string): Date {
    const daymonthyear = str.split('/');
    let year = +daymonthyear[1];
    year = year < 90 ? 2000 + year : year;
    const month = +daymonthyear[0];
    return new Date(year, month - 1, 1);
  },
  max: new Date(2099, 12, 31),
  autofix: false,
  overwrite: false,
  min: new Date(1970, 0, 1),
  lazy: true,
};

export default imaskDateMonthOptions;
