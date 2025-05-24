import { TransactionEntity } from '../entities/transaction.entity';

export interface TransactionRepositoryPort {
  create(transaction: TransactionEntity): Promise<TransactionEntity>;
  updateStatus(id: string, status: string, result?: any): Promise<void>;
}
