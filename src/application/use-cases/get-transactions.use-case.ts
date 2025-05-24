import { Inject } from '@nestjs/common';

import { TransactionEntity } from 'src/domain/entities';
import { TransactionRepositoryPort } from 'src/domain/ports';
import { IResponse } from '../model/IResponse.model';

export class GetTransactionsUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
  ) {}

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
