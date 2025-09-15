import IMask from 'imask';
import { imaskDateMonthOptions } from './date-month-imask-options';

describe('imaskDateMonthOptions', () => {
  it('should format date correctly', () => {
    const date = new Date(2023, 4, 15);
    const formattedDate = imaskDateMonthOptions.format(date);
    expect(formattedDate).toBe('05/2023');
  });

  it('should parse date string correctly', () => {
    const dateString = '05/2023';
    const parsedDate = imaskDateMonthOptions.parse(dateString);
    expect(parsedDate.getFullYear()).toBe(2023);
    expect(parsedDate.getMonth()).toBe(4);
    expect(parsedDate.getDate()).toBe(1);
  });

  it('should handle two-digit year correctly', () => {
    const dateString = '05/23';
    const parsedDate = imaskDateMonthOptions.parse(dateString);
    expect(parsedDate.getFullYear()).toBe(2023);
    expect(parsedDate.getMonth()).toBe(4);
    expect(parsedDate.getDate()).toBe(1);
  });

  it('should have correct max date', () => {
    const maxDate = imaskDateMonthOptions.max;
    expect(maxDate.getFullYear()).toBe(2100);
    expect(maxDate.getMonth()).toBe(0);
    expect(maxDate.getDate()).toBe(31);
  });

  it('should have correct min date', () => {
    const minDate = imaskDateMonthOptions.min;
    expect(minDate.getFullYear()).toBe(1970);
    expect(minDate.getMonth()).toBe(0);
    expect(minDate.getDate()).toBe(1);
  });

  it('should have correct mask pattern', () => {
    expect(imaskDateMonthOptions.pattern).toBe('m{/}Y');
  });

  it('should have correct block configurations', () => {
    const blocks = imaskDateMonthOptions.blocks;
    expect(blocks.m.mask).toBe(IMask.MaskedRange);
    expect(blocks.m.maxLength).toBe(2);
    expect(blocks.m.from).toBe(1);
    expect(blocks.m.to).toBe(99);

    expect(blocks.Y.mask).toBe(IMask.MaskedRange);
    expect(blocks.Y.from).toBe(1000);
    expect(blocks.Y.to).toBe(9999);
    expect(blocks.Y.overwrite).toBe(false);
    expect(blocks.Y.minLength).toBe(2);
    expect(blocks.Y.autofix).toBe(false);
    expect(blocks.Y.maxLength).toBe(4);
  });
});
