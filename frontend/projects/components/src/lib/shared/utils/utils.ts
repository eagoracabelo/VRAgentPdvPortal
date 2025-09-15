import { AbstractControl, ControlContainer } from '@angular/forms';
export function getControl(
  controlContainer: ControlContainer | undefined,
  formControlName: string | undefined,
): AbstractControl | null {
  if (
    controlContainer &&
    formControlName &&
    typeof formControlName === 'string'
  ) {
    return controlContainer?.control?.get(formControlName) ?? null;
  }
  return null;
}

export function isDate(date: Date | string | number): boolean {
  try {
    if (date) {
      if (date instanceof Date) {
        return true;
      }
      if (typeof date === 'string') {
        return !isNaN(Date.parse(date));
      }
      if (typeof date === 'number') {
        date = new Date(date);
        return !isNaN(date.getTime());
      }
    }

    return false;
  } catch {
    return false;
  }
}

export function validateDateDDMMYYYY(
  day: number,
  month: number,
  year: number,
): boolean {
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }

  if (day <= 0 || month <= 0 || year <= 0) {
    return false;
  }

  if (month > 12) {
    return false;
  }

  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0) {
    daysPerMonth[1] = 29;
  }

  if (day > daysPerMonth[month - 1]) {
    return false;
  }

  return true;
}

let nextUniqueId = Number.MIN_SAFE_INTEGER;
export function getRandomId(): string {
  const fixedNumber = nextUniqueId++;
  const timestamp = new Date().getTime();

  const fixedString = 'vr';

  const randomParts = [];
  const randomValues = new Uint16Array(4);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < 4; i++) {
    const randomHex = randomValues[i].toString(16).padStart(4, '0');
    randomParts.push(randomHex);
  }

  const id = `${timestamp}${fixedString}${randomParts[0]}${fixedNumber}${randomParts[1]}${fixedNumber}${randomParts[2]}${fixedNumber}${randomParts[3]}`;

  return id;
}

export function isDefined(value: unknown): boolean {
  return value !== undefined && value !== null;
}

export function stringHasLowerCase(value: string): boolean {
  if (!value || value.length === 0) {
    return false;
  }

  return value.toUpperCase() !== value;
}
