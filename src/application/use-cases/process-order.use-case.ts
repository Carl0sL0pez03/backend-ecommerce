import { Inject } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { TransactionEntity } from '../../domain/entities';
import {
  DeliveryRepositoryPort,
  PaymentGatewayPort,
  ProductRepositoryPort,
  TransactionRepositoryPort,
} from '../../domain/ports';
import { TransactionStatus } from '../../domain/enum/TransactionStatus.enum';
import { IOrderParams } from '../model/IOrderParams.model';
import { IResponse } from '../model/IResponse.model';
import { maskCard } from '../function/aux-use-cases.function';

export class ProcessOrderUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
    @Inject('PaymentGatewayPort')
    private readonly paymentGateway: PaymentGatewayPort,
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

  async execute(order: IOrderParams): Promise<IResponse<TransactionEntity>> {
    const transactionId = uuidv4();
    const maskedCard = maskCard(order.payment.cardNumber);

    const transaction = new TransactionEntity(
      transactionId,
      order.customer,
      { maskedCard, expiry: order.payment.expiry },
      order.items,
      order.total,
      TransactionStatus.PENDING,
    );

    try {
      await this.transactionRepo.create(transaction);

      const paymentResult = await this.paymentGateway.charge({
        amount: order.total,
        cardNumber: order.payment.cardNumber,
        expiry: order.payment.expiry,
        cvc: order.payment.cvc,
        cardHolder: order?.payment?.cardHolder,
        customerEmail: order?.customer?.email,
        installments: order?.payment?.installments,
      });

      if (!paymentResult.success) {
        await this.transactionRepo.updateStatus(
          transactionId,
          TransactionStatus.FAILED,
          paymentResult?.result?.data,
        );
        return {
          success: false,
          error: paymentResult?.result || 'Payment failed',
        };
      }

      await Promise.allSettled([
        this.transactionRepo.updateStatus(
          transactionId,
          TransactionStatus.COMPLETED,
          paymentResult?.result?.data,
        ),
        this.deliveryRepo.assignToCustomer(transactionId, order.items),
        this.productRepo.decreaseStock(order.items),
      ]);

      return { success: true, data: transaction };
    } catch (error) {
      await this.transactionRepo.updateStatus(
        transactionId,
        TransactionStatus.FAILED,
        {
          error,
        },
      );
      return {
        success: false,
        error: error?.message || 'Unexpected error processing transaction',
      };
    }
  }
}
