import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import { DeliveryEntity } from 'src/domain/entities';
import { DeliveryRepositoryPort } from 'src/domain/ports';

export class DynamoDBDeliveryRepository implements DeliveryRepositoryPort {
  private client: DynamoDBDocumentClient;

  constructor() {
    const baseClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.client = DynamoDBDocumentClient.from(baseClient);
  }

  async findAllWithProductNames(): Promise<DeliveryEntity[]> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: 'Deliveries',
      }),
    );

    const deliveries = result.Items || [];

    const productIds = [
      ...new Set(deliveries.map((delivery) => String(delivery.productId))),
    ];

    const keys = productIds.map((id) => ({ _id: id }));

    const productResult = await this.client.send(
      new BatchGetCommand({
        RequestItems: {
          Products: {
            Keys: keys,
          },
        },
      }),
    );

    const productMap = new Map<string, string>();
    (productResult?.Responses?.Products || []).forEach((product) => {
      productMap.set(String(product._id), String(product.name));
    });

    return deliveries.map((item) => {
      const productId = String(item.productId);
      const productName = productMap.get(productId) ?? 'Desconocido';

      return new DeliveryEntity(
        String(item.deliveryId),
        String(item.deliveredAt),
        String(item.orderId),
        productId,
        Number(item.quantity),
        productName,
      );
    });
  }

  async assignToCustomer(
    orderId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<void> {
    for (const item of items) {
      await this.client.send(
        new PutCommand({
          TableName: 'Deliveries',
          Item: {
            deliveryId: `${orderId}_${item.productId}`,
            orderId: orderId,
            productId: item.productId,
            quantity: item.quantity,
            deliveredAt: new Date().toISOString(),
          },
        }),
      );
    }
  }
}
