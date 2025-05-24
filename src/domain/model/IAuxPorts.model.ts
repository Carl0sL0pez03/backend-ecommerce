export interface IParamsPaymentGatewayPort {
  amount: number;
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardHolder: string;
  customerEmail: string;
  installments: number;
}

export interface IResponsePaymentGatewayPort {
  success: boolean;
  transactionId?: string;
  result: any;
}

export interface IResponseFindManyByIds {
  id: string;
  name: string;
}

export interface IParamsDecreaseStock {
  productId: string;
  quantity: number;
}
