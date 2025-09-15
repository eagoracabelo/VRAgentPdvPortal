import IMask, { Masked } from 'imask';
import imaskDateOptions from './date-imask-options';
import { IMaskDateOptions } from './interfaces/mask-date-options.interface';

const typedImaskDateOptions = imaskDateOptions as unknown as IMaskDateOptions;

export const imaskDatetimeOptions = {
  mask: Date,
  pattern: 'd{/}m{/}Y HH:mm',
  blocks: {
    ...typedImaskDateOptions.blocks,
    HH: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 23,
    },
    mm: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
      maxLength: 2,
    },
  },
  format(date: Date | null, _: Masked): string {
    if (!date) return '';
    const stringDate = typedImaskDateOptions.format(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${stringDate} ${hours}:${minutes}`;
  },
  parse(str: string): Date {
    const splitDateTime = str.split(' ');
    const dateString = splitDateTime[0];
    const timeString = splitDateTime[1];
    const [hours, minutes] = timeString.split(':').map(Number);
    const parsedDate = typedImaskDateOptions.parse(dateString);

    parsedDate.setHours(hours, minutes, 0, 0);

    return parsedDate;
  },
  min: new Date(1970, 0, 1),
  max: new Date(2099, 12, 31),
  autofix: false,
  lazy: true,
  overwrite: false,
};

export default imaskDatetimeOptions;
