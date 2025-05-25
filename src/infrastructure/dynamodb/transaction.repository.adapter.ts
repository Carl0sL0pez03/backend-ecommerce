import { Inject } from '@nestjs/common';

import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { TransactionEntity } from '../../domain/entities';
import {
  ProductRepositoryPort,
  TransactionRepositoryPort,
} from '../../domain/ports';
import {
  createClientDynamo,
  getProductName,
} from '../function/auxDynamoDb.function';

/**
 * Implementation of the TransactionRepositoryPort using AWS DynamoDB.
 *
 * This repository handles all operations related to transactions including
 * creation, status updates, and retrieving all transactions with enriched product names.
 */
export class DynamoDBTransactionRepository
  implements TransactionRepositoryPort
{
  private client: DynamoDBDocumentClient;

  /**
   * Initializes the DynamoDBTransactionRepository with a DynamoDB client and
   * injects the ProductRepositoryPort to resolve product names from product IDs.
   *
   * @param {ProductRepositoryPort} productRepo - The product repository used to fetch product details.
   */
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {
    this.client = createClientDynamo({
      marshallOptions: {
        convertClassInstanceToMap: true,
      },
    });
  }

  /**
   * Builds a map of product IDs to product names from a list of transactions.
   *
   * @param {any[]} transactions - The list of transactions containing product IDs.
   * @returns {Promise<Map<string, string>>} A promise that resolves to a map of productId => productName.
   */
  private async buildProductMap(
    transactions: any[],
  ): Promise<Map<string, string>> {
    const productIds = new Set<string>();
    for (const transaction of transactions) {
      for (const item of transaction.items || []) {
        productIds.add(item?.productId);
      }
    }

    const products = await this.productRepo.findManyByIds([...productIds]);
    return new Map(products.map((p) => [p.id, p.name]));
  }

  /**
   * Retrieves all transactions from the 'Transactions' table and enriches items with product names.
   *
   * @returns {Promise<TransactionEntity[]>} A promise that resolves to an array of enriched TransactionEntity objects.
   */
  async findAll(): Promise<TransactionEntity[]> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: 'Transactions',
      }),
    );

    const transactions = result?.Items || [];

    const productMap = await this.buildProductMap(transactions);

    return transactions.map((item) => {
      const itemsWithNames = item.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: getProductName(item.productId, productMap),
      }));

      return new TransactionEntity(
        String(item._id),
        item.customer,
        item.payment,
        itemsWithNames,
        Number(item.total),
        item.status,
        item.wompiId,
        item.result,
      );
    });
  }

  /**
   * Persists a new transaction in the 'Transactions' table.
   *
   * @param {TransactionEntity} transaction - The transaction to be stored.
   * @returns {Promise<TransactionEntity>} A promise that resolves to the created transaction.
   */
  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    await this.client.send(
      new PutCommand({
        TableName: 'Transactions',
        Item: {
          _id: transaction?._id,
          customer: transaction.customer,
          payment: transaction.payment,
          items: transaction.items,
          total: transaction.total,
          status: transaction.status,
          createdAt: new Date().toISOString(),
        },
      }),
    );

    return transaction;
  }

  /**
   * Updates the status and result of a transaction.
   *
   * @param {string} id - The ID of the transaction to update.
   * @param {string} status - The new status to assign.
   * @param {any} [result] - Optional result or metadata about the transaction.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async updateStatus(id: string, status: string, result?: any): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: 'Transactions',
        Key: { _id: id },
        UpdateExpression:
          'SET #status = :status, #result = :result, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#status': 'status',
          '#result': 'result',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':result': result ?? null,
          ':updatedAt': new Date().toISOString(),
        },
      }),
    );
  }
}
