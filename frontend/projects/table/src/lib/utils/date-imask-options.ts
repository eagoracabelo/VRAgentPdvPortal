import { FactoryOpts, MaskedRegExp } from 'imask';

const OPTIONSDATE: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};
const OPTIONSTIME: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

interface IMaskOptions {
  autofix: boolean;
  commit: (value: string, masked: IMaskOptions) => void;
  format: (value: Date) => string;
  isInitialized: boolean;
  lazy: boolean;
  mask: string;
  overwrite: boolean;
  parse: (value: string) => Date;
  validate: (value: string, masked: IMaskOptions, flags: unknown) => boolean;
  _value: string;
  isComplete: boolean;
  rawInputValue: string;
  state: unknown;
  typedValue: string;
  unmaskedValue: string;
  value: string;
}

const imaskPartilaOptions: Partial<FactoryOpts> = {
  mask: /^[a-zA-Z0-9:-]+$/,
  autofix: true,
  lazy: true,
  overwrite: true,
};

export const imaskDateTimeOptions = (locale: string): MaskedRegExp => {
  return {
    ...imaskPartilaOptions,
    commit: (value: string, masked: IMaskOptions): void => {
      masked._value = imaskFormatDateTime(value, locale);
    },
  } as unknown as MaskedRegExp;
};

export const imaskFormatDateTime = (str: string, locale: string): string => {
  const date = new Date(str);
  return date.toLocaleDateString(locale, { ...OPTIONSDATE, ...OPTIONSTIME });
};

export const imaskDateOptions = (locale: string): MaskedRegExp => {
  return {
    ...imaskPartilaOptions,
    commit: (value: string, masked: IMaskOptions): void => {
      masked._value = imaskFormatDate(value, locale);
    },
  } as unknown as MaskedRegExp;
};

export const imaskFormatDate = (str: string, locale: string): string => {
  const date = new Date(str);
  return date.toLocaleDateString(locale, { ...OPTIONSDATE });
};

export const imaskTimeOptions = (locale: string): MaskedRegExp => {
  return {
    ...imaskPartilaOptions,
    commit: (value: string, masked: IMaskOptions): void => {
      masked._value = imaskFormatTime(value, locale);
    },
  } as unknown as MaskedRegExp;
};

export const imaskFormatTime = (str: string, locale: string): string => {
  const date = new Date(str);
  return date.toLocaleTimeString(locale, { ...OPTIONSTIME });
};
