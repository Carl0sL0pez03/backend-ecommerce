/**
 * Interface representing the required parameters to initiate a payment charge.
 */
export interface IChargeParams {
  /**
   * The total amount to charge in local currency (e.g., COP).
   */
  amount: number;

  /**
   * The full credit/debit card number as a string.
   */
  cardNumber: string;

  /**
   * The card's expiration date in MM/YY format.
   */
  expiry: string;

  /**
   * The card's CVC or CVV security code.
   */
  cvc: string;

  /**
   * The full name of the cardholder.
   */
  cardHolder: string;

  /**
   * The email address associated with the customer making the payment.
   */
  customerEmail: string;

  /**
   * Number of payment installments selected by the customer.
   */
  installments: number;
}
