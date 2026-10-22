const ROMAN: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/** Converts a positive integer to its Roman numeral form. */
export function toRoman(value: number): string {
  if (!Number.isFinite(value) || value < 1) {
    return String(value);
  }

  let remaining = Math.floor(value);
  let result = '';

  for (const [amount, numeral] of ROMAN) {
    while (remaining >= amount) {
      result += numeral;
      remaining -= amount;
    }
  }

  return result;
}
