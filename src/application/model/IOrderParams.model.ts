/**
 * Interface representing the parameters required to process an order.
 */
export interface IOrderParams {
  /**
   * Customer information including name, address, city, and email.
   */
  customer: {
    /** Full name of the customer */
    name: string;
    /** Delivery address */
    address: string;
    /** City of the customer */
    city: string;
    /** Email address of the customer */
    email: string;
  };

  /**
   * Payment information used to process the transaction.
   */
  payment: {
    /** Credit card number */
    cardNumber: string;
    /** Expiry date in MM/YY format */
    expiry: string;
    /** Card Verification Code (CVC) */
    cvc: string;
    /** Full name of the cardholder */
    cardHolder: string;
    /** Number of installments selected by the customer */
    installments: number;
  };

  /**
   * List of items included in the order.
   */
  items: {
    /** Unique identifier of the product */
    productId: string;
    /** Quantity of the product ordered */
    quantity: number;
  }[];

  /**
   * Total amount to be charged for the order.
   */
  total: number;
}
