import { Body, Controller, Get, Post } from '@nestjs/common';

import { IOrderParams } from '../../application/model/IOrderParams.model';
import {
  GetTransactionsUseCase,
  ProcessOrderUseCase,
} from '../../application/use-cases';

/**
 * Controller responsible for handling transaction-related HTTP requests.
 */
@Controller('transactions')
export class TransactionController {
  /**
   * Creates an instance of TransactionController.
   *
   * @param {ProcessOrderUseCase} processOrderUseCase - Use case for processing and creating transactions.
   * @param {GetTransactionsUseCase} getTransactionsUseCase - Use case for retrieving transactions.
   */
  constructor(
    private readonly processOrderUseCase: ProcessOrderUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  /**
   * GET /transactions/getAll
   * Retrieves all transactions with customer, items, total, status, and limited result details.
   *
   * @returns List of transactions or an error object.
   */
  @Get('getAll')
  async findAll() {
    const result = await this.getTransactionsUseCase.execute();
    return result.success ? result.data : { error: result.error };
  }

  /**
   * POST /transactions/create
   * Creates a new transaction, processes the payment, updates the stock, and assigns delivery.
   *
   * @param {IOrderParams} order - Order parameters including customer, payment, and item details.
   * @returns  Created transaction data or an error object.
   */
  @Post('create')
  async create(@Body() order: IOrderParams) {
    const result = await this.processOrderUseCase.execute(order);
    if (result.success) return result.data;
    return { error: result.error };
  }
}
