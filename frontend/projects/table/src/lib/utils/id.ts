export function id(): string {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);

  const randomNumber = randomValues[0];
  const base36String = (randomNumber % Math.pow(36, 4)).toString(36);

  const paddedString = base36String.padStart(4, '0');
  const finalId = paddedString.slice(-4);

  return finalId;
}
