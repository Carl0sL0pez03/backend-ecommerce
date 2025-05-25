import { Inject } from '@nestjs/common';

import { TransactionEntity } from '../../domain/entities';
import { TransactionRepositoryPort } from '../../domain/ports';
import { IResponse } from '../model/IResponse.model';

/**
 * Use case for retrieving all transactions with selected fields.
 *
 * This class belongs to the Application layer and uses the Hexagonal Architecture (Ports & Adapters).
 * It fetches transactions from the TransactionRepositoryPort and filters the result to expose only
 * partial data such as customer, items, total, status, and relevant payment result details.
 */
export class GetTransactionsUseCase {
  /**
   * Constructs the GetTransactionsUseCase with a transaction repository dependency.
   *
   * @param {TransactionRepositoryPort} transactionRepo - The repository interface for accessing transactions.
   */
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  /**
   * Executes the use case to retrieve all transactions with filtered data.
   *
   * @returns {Promise<IResponse<Partial<TransactionEntity>>>} A response object containing a list of transactions
   * with selected fields, or an error message if the operation fails.
   */
  async execute(): Promise<IResponse<Partial<TransactionEntity>>> {
    try {
      const transactions = await this.transactionRepo.findAll();

      const filtered = transactions.map((transaction) => ({
        customer: transaction.customer,
        items: transaction.items,
        total: transaction.total,
        status: transaction.status,
        result: {
          payment_method: {
            installments: transaction.result?.payment_method?.installments,
            type: transaction.result?.payment_method?.type,
          },
          status: transaction.result?.status,
        },
      }));

      return { success: true, data: filtered };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Could not retrieve transactions',
      };
    }
  }
}
