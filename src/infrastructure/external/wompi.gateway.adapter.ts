import axios from 'axios';
import * as crypto from 'crypto';

import { PaymentGatewayPort } from 'src/domain/ports';
import { IChargeParams } from './model/IChargeParams.model';

export class WompiGatewayAdapter implements PaymentGatewayPort {
  async charge(
    params: IChargeParams,
  ): Promise<{ success: boolean; transactionId?: string; result: any }> {
    try {
      const [exp_month, exp_year] = params.expiry.split('/');

      const acceptanceRes = await axios.get(
        `${process.env.WOMPI_API_RUL}merchants/${process.env.WOMPI_PUBLIC_KEY}`,
      );

      const acceptance_token =
        acceptanceRes.data?.data?.presigned_acceptance?.acceptance_token;

      if (!acceptance_token) {
        return { success: false, result: 'No acceptance token returned' };
      }

      const tokenResponse = await axios.post(
        `${process.env.WOMPI_API_RUL}tokens/cards`,
        {
          number: params.cardNumber,
          cvc: params.cvc,
          exp_month,
          exp_year,
          card_holder: params?.cardHolder || 'test',
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const token = tokenResponse.data?.data?.id;

      if (!token) {
        return {
          success: false,
          result: 'Failed to retrieve token from Wompi',
        };
      }

      const amountInCents = params.amount * 100;
      const currency = 'COP';
      const reference = 'order_ref_' + Date.now();
      const integrityKey = process.env.WOMPI_INTEGRITY_KEY || '';

      const rawString = `${reference}${amountInCents}${currency}${integrityKey}`;
      const integritySignature = crypto
        .createHash('sha256')
        .update(rawString)
        .digest('hex');

      const response = await axios.post(
        `${process.env.WOMPI_API_RUL}transactions`,
        {
          amount_in_cents: amountInCents,
          currency: currency,
          customer_email: params?.customerEmail,
          payment_method: {
            type: 'CARD',
            token,
            installments: params?.installments || 1,
          },
          reference,
          acceptance_token,
          signature: integritySignature,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        success: true,
        transactionId: response?.data?.data?.id,
        result: response?.data,
      };
    } catch (error) {
      return {
        success: false,
        result: error?.response?.data || error?.message,
      };
    }
  }
}
