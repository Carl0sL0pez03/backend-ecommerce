import {
  IParamsPaymentGatewayPort,
  IResponsePaymentGatewayPort,
} from '../model/IAuxPorts.model';

export interface PaymentGatewayPort {
  charge(
    params: IParamsPaymentGatewayPort,
  ): Promise<IResponsePaymentGatewayPort>;
}
