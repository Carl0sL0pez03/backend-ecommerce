export interface IOrderParams {
  customer: {
    name: string;
    address: string;
    city: string;
    email: string;
  };
  payment: {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardHolder: string;
    installments: number
  };
  items: { productId: string; quantity: number }[];
  total: number;
}
