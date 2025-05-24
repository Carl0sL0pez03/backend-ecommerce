export function maskCard(cardNumber: string): string {
  return cardNumber.replace(/\D/g, '').replace(/.(?=.{4})/g, '*');
}
