import { TransactionEntity } from '../entities/transaction.entity';

/**
 * Port interface for handling transaction-related persistence operations.
 *
 * This interface abstracts the data access layer for transactions,
 * following the principles of Hexagonal Architecture.
 */
export interface TransactionRepositoryPort {
  /**
   * Retrieves all transactions from the data source.
   *
   * @returns {Promise<TransactionEntity[]>} A promise that resolves to an array of transaction entities.
   */
  findAll(): Promise<TransactionEntity[]>;

  /**
   * Persists a new transaction in the data source.
   *
   * @param {TransactionEntity} transaction - The transaction entity to create.
   * @returns {Promise<TransactionEntity>} A promise that resolves to the newly created transaction.
   */
  create(transaction: TransactionEntity): Promise<TransactionEntity>;

  /**
   * Updates the status of a specific transaction, optionally storing additional result data.
   *
   * @param {string} id - The ID of the transaction to update.
   * @param {string} status - The new status to assign to the transaction (e.g., COMPLETED, FAILED).
   * @param {any} [result] - Optional result or error object associated with the update.
   * @returns {Promise<void>} A promise that resolves when the transaction is successfully updated.
   */
  updateStatus(id: string, status: string, result?: any): Promise<void>;
}
