import { Inject } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { TransactionEntity } from 'src/domain/entities';
import {
  PaymentGatewayPort,
  ProductRepositoryPort,
  TransactionRepositoryPort,
} from 'src/domain/ports';
import { TransactionStatus } from 'src/domain/enum/TransactionStatus.enum';
import { IOrderParams } from '../model/IOrderParams.model';

export class ProcessOrderUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
    @Inject('PaymentGatewayPort')
    private readonly paymentGateway: PaymentGatewayPort,
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(
    order: IOrderParams,
  ): Promise<{ success: boolean; data?: TransactionEntity; error?: string }> {
    const transactionId = uuidv4();
    const maskedCard = order.payment.cardNumber
      .replace(/\D/g, '')
      .replace(/.(?=.{4})/g, '*');

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
        this.productRepo.assignToCustomer(transactionId, order.items),
        this.productRepo.decreaseStock(order.items),
      ]);

      return { success: true, data: transaction };
    } catch (error) {
      console.log(error);

      await this.transactionRepo.updateStatus(
        transactionId,
        TransactionStatus.FAILED,
        {
          error,
        },
      );
      return {
        success: false,
        error: 'Unexpected error processing transaction',
      };
    }
  }
}
