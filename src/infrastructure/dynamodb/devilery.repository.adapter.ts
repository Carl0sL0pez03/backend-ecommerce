import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import { DeliveryEntity } from '../../domain/entities';
import { DeliveryRepositoryPort } from '../../domain/ports';
import {
  createClientDynamo,
  getProductName,
} from '../function/auxDynamoDb.function';

/**
 * DynamoDB implementation of the DeliveryRepositoryPort.
 *
 * This class handles persistence and retrieval of delivery data from AWS DynamoDB.
 */
export class DynamoDBDeliveryRepository implements DeliveryRepositoryPort {
  private client: DynamoDBDocumentClient;

  /**
   * Initializes the DynamoDBDocumentClient with default settings for interacting with DynamoDB.
   */
  constructor() {
    this.client = createClientDynamo();
  }

  /**
   * Retrieves a map of product IDs to product names from the 'Products' table.
   *
   * @private
   * @param {string[]} productIds - An array of product IDs to fetch.
   * @returns {Promise<Map<string, string>>} A promise that resolves to a map of productId → productName.
   */
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

  /**
   * Retrieves all deliveries from the 'Deliveries' table and adds product names to them.
   *
   * @returns {Promise<DeliveryEntity[]>} A promise that resolves to a list of DeliveryEntity with product names included.
   */
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

  /**
   * Creates delivery records in the 'Deliveries' table for each product item in the order.
   *
   * @param {string} orderId - The ID of the order.
   * @param {Array<{ productId: string; quantity: number }>} items - List of products and quantities to assign.
   * @returns {Promise<void>} A promise that resolves when all delivery records have been written.
   */
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
