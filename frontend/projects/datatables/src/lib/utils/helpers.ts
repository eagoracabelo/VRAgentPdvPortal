export function isArrayNumber(value: unknown[]): boolean {
  if (isArray(value)) {
    return value.every((val) => isNumber(val));
  }

  return false;
}

export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

export function isNumber(value: unknown): boolean {
  return !isNaN(Number(value)) && typeof value === 'number';
}
