import { Inject } from '@nestjs/common';
import { TransactionEntity } from 'src/domain/entities';

import { TransactionRepositoryPort } from 'src/domain/ports';

export class GetTransactionsUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(): Promise<{
    success: boolean;
    data?: Partial<TransactionEntity>[];
    error?: string;
  }> {
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
      return { success: false, error: 'Could not retrieve transactions' };
    }
  }
}
