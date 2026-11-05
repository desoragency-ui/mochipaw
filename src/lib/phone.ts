/**
 * Moroccan phone numbers. Accepts 06/07/05 local numbers and +212 / 00212 forms.
 * Returns the international form 212XXXXXXXXX, or null when the number is not valid.
 */
export function normalizeMoroccanPhone(input: string): string | null {
  const digits = input.replace(/[\s.\-()]/g, '').replace(/^\+/, '').replace(/^00/, '');
  let national: string;
  if (digits.startsWith('212')) national = digits.slice(3).replace(/^0/, '');
  else if (digits.startsWith('0')) national = digits.slice(1);
  else return null;
  return /^[567]\d{8}$/.test(national) ? `212${national}` : null;
}

/** Shows a number the way people write it in Morocco: 06 12 34 56 78. */
export function formatMoroccanPhone(international: string): string {
  const national = `0${international.replace(/^212/, '')}`;
  return national.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}
