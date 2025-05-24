import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { TransactionEntity } from 'src/domain/entities';
import { TransactionRepositoryPort } from 'src/domain/ports';

export class DynamoDBTransactionRepository
  implements TransactionRepositoryPort
{
  private client: DynamoDBDocumentClient;

  constructor() {
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
