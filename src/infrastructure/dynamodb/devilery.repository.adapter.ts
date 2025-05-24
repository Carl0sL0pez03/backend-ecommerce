import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import { DeliveryEntity } from 'src/domain/entities';
import { DeliveryRepositoryPort } from 'src/domain/ports';
import {
  createClientDynamo,
  getProductName,
} from '../function/auxDynamoDb.function';

export class DynamoDBDeliveryRepository implements DeliveryRepositoryPort {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = createClientDynamo();
  }

  private async getProductNameMap(
    productIds: string[],
  ): Promise<Map<string, string>> {
    const keys = productIds.map((id) => ({ _id: id }));

    const productResult = await this.client.send(
      new BatchGetCommand({
        RequestItems: {
          Products: { Keys: keys },
        },
      }),
    );

    const productMap = new Map<string, string>();
    (productResult?.Responses?.Products || []).forEach((product) => {
      productMap.set(String(product._id), String(product.name));
    });

    return productMap;
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
    const productMap = await this.getProductNameMap(productIds);

    return deliveries.map((item) => {
      const productId = String(item.productId);
      const productName = getProductName(productId, productMap);

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
