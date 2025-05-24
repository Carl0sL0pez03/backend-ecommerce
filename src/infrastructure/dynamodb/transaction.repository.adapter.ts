import { Inject } from '@nestjs/common';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { TransactionEntity } from 'src/domain/entities';
import {
  ProductRepositoryPort,
  TransactionRepositoryPort,
} from 'src/domain/ports';

export class DynamoDBTransactionRepository
  implements TransactionRepositoryPort
{
  private client: DynamoDBDocumentClient;

  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {
    const dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    this.client = DynamoDBDocumentClient.from(dynamoDBClient, {
      marshallOptions: {
        convertClassInstanceToMap: true,
      },
    });
  }

  async findAll(): Promise<TransactionEntity[]> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: 'Transactions',
      }),
    );

    const transactions = result?.Items || [];

    const productIds = new Set<string>();
    for (const transaction of transactions) {
      for (const item of transaction.items || []) {
        productIds.add(item?.productId);
      }
    }

    const products = await this.productRepo.findManyByIds([...productIds]);
    const productMap = new Map(
      products.map((product) => [product.id, product.name]),
    );

    return transactions.map((item) => {
      const itemsWithNames = item.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: productMap.get(item.productId) ?? 'Desconocido',
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
