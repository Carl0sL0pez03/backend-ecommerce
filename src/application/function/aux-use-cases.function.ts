/**
 * Masks a credit card number by replacing all but the last four digits with asterisks.
 *
 * @param {string} cardNumber - The credit card number to mask.
 * @returns {string} The masked credit card number, showing only the last four digits.
 *
 * @example
 * maskCard('4111 1111 1111 1234'); // returns '************1234'
 */
export function maskCard(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '').replace(/.(?=.{4})/g, '*');
}
