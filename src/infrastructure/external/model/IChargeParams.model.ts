export interface IChargeParams {
  amount: number;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardHolder: string;
  customerEmail: string;
  installments: number
}
