import { Inject } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { TransactionEntity } from '../../domain/entities';
import {
  DeliveryRepositoryPort,
  PaymentGatewayPort,
  ProductRepositoryPort,
  TransactionRepositoryPort,
} from '../../domain/ports';
import { transactionStatus } from '../../domain/enum/transactionStatus.enum';
import { IOrderParams } from '../model/IOrderParams.model';
import { IResponse } from '../model/IResponse.model';
import { maskCard } from '../function/aux-use-cases.function';

/**
 * Use case for processing an order end-to-end.
 *
 * This class coordinates the transaction creation, payment processing,
 * delivery assignment, and product stock update.
 * It adheres to Hexagonal Architecture and applies the principles of
 * Railway Oriented Programming (ROP) to manage success/failure flows.
 */
export class ProcessOrderUseCase {
  /**
   * Constructor to inject required repositories and services (Ports).
   *
   * @param {TransactionRepositoryPort} transactionRepo - Port to handle transaction persistence.
   * @param {PaymentGatewayPort} paymentGateway - Port to integrate with the payment provider (e.g., Wompi).
   * @param {ProductRepositoryPort} productRepo - Port to manage product inventory.
   * @param {DeliveryRepositoryPort} deliveryRepo - Port to assign product deliveries to customers.
   */
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

  /**
   * Executes the order processing logic:
   * 1. Creates a transaction with status PENDING.
   * 2. Processes the payment via the payment gateway.
   * 3. Updates the transaction status and, if successful, assigns deliveries and reduces stock.
   *
   * @param {IOrderParams} order - The order data including customer, payment, and product items.
   * @returns {Promise<IResponse<TransactionEntity>>} A response with the transaction or an error message.
   */
  async execute(order: IOrderParams): Promise<IResponse<TransactionEntity>> {
    const transactionId = uuidv4();
    const maskedCard = maskCard(order.payment.cardNumber);

    const transaction = new TransactionEntity(
      transactionId,
      order.customer,
      { maskedCard, expiry: order.payment.expiry },
      order.items,
      order.total,
      transactionStatus.PENDING,
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
          transactionStatus.FAILED,
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
          transactionStatus.COMPLETED,
          paymentResult?.result?.data,
        ),
        this.deliveryRepo.assignToCustomer(transactionId, order.items),
        this.productRepo.decreaseStock(order.items),
      ]);

      return { success: true, data: transaction };
    } catch (error) {
      await this.transactionRepo.updateStatus(
        transactionId,
        transactionStatus.FAILED,
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
