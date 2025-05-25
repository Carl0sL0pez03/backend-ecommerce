import {
  IParamsPaymentGatewayPort,
  IResponsePaymentGatewayPort,
} from '../model/IAuxPorts.model';

/**
 * Port interface for integrating a payment gateway.
 *
 * This interface defines the contract for charging payments through an external gateway
 * such as Wompi.
 */
export interface PaymentGatewayPort {
  /**
   * Charges a payment using the provided parameters.
   *
   * @param {IParamsPaymentGatewayPort} params - The parameters required to process the payment.
   * @returns {Promise<IResponsePaymentGatewayPort>} A promise that resolves with the result of the payment operation.
   */
  charge(
    params: IParamsPaymentGatewayPort,
  ): Promise<IResponsePaymentGatewayPort>;
}
