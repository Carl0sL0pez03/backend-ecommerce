export interface PaymentGatewayPort {
  charge(params: {
    amount: number;
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardHolder: string;
    customerEmail: string;
    installments: number;
  }): Promise<{
    success: boolean;
    transactionId?: string;
    result: any;
  }>;
}
