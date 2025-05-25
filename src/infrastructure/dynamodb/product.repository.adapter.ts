import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { ProductEntity } from '../../domain/entities';
import { ProductRepositoryPort } from '../../domain/ports';
import { createClientDynamo } from '../function/auxDynamoDb.function';

/**
 * DynamoDB implementation of the ProductRepositoryPort.
 *
 * Provides methods for interacting with the 'Products' table in DynamoDB,
 * including retrieving, updating, and managing product stock.
 */
export class DynammoDBProductRepository implements ProductRepositoryPort {
  private client: DynamoDBDocumentClient;

  /**
   * Initializes the DynamoDBDocumentClient with default settings for interacting with DynamoDB.
   */
  constructor() {
    this.client = createClientDynamo();
  }

  /**
   * Retrieves all products from the 'Products' table.
   *
   * @returns {Promise<ProductEntity[]>} A promise that resolves to an array of ProductEntity objects.
   */
  async findAll(): Promise<ProductEntity[]> {
    const products = await this.client.send(
      new ScanCommand({
        TableName: 'Products',
      }),
    );

    return (products.Items || []).map(
      (product) =>
        new ProductEntity(
          String(product?._id),
          String(product?.name),
          Number(product?.price),
          Number(product?.stock),
          String(product?.urlImg),
        ),
    );
  }

  /**
   * Retrieves multiple product names by their IDs using a batch operation.
   *
   * @param {string[]} ids - An array of product IDs to retrieve.
   * @returns {Promise<{ id: string; name: string }[]>} A promise that resolves to an array of product ID-name pairs.
   */
  async findManyByIds(ids: string[]): Promise<{ id: string; name: string }[]> {
    if (ids?.length === 0) return [];

    const keys = ids.map((id) => ({ _id: id }));
    const result = await this.client.send(
      new BatchGetCommand({
        RequestItems: {
          Products: {
            Keys: keys,
          },
        },
      }),
    );

    return (result?.Responses?.Products || []).map((item) => ({
      id: String(item._id),
      name: String(item.name),
    }));
  }

  /**
   * Updates a product in the 'Products' table with new values.
   *
   * @param {ProductEntity} product - The product entity containing updated fields.
   * @returns {Promise<ProductEntity>} A promise that resolves to the updated product entity.
   */
  async update(product: ProductEntity): Promise<ProductEntity> {
    await this.client.send(
      new UpdateCommand({
        TableName: 'Products',
        Key: { _id: product._id },
        UpdateExpression:
          'SET #name = :name, #price = :price, #stock = :stock, #urlImg = :urlImg',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#price': 'price',
          '#stock': 'stock',
          '#urlImg': 'urlImg',
        },
        ExpressionAttributeValues: {
          ':name': product.name,
          ':price': product.price,
          ':stock': product.stock,
          ':urlImg': product.urlImg,
        },
      }),
    );

    return product;
  }

  /**
   * Decreases the stock for a list of products based on order quantities.
   *
   * @param {{ productId: string; quantity: number }[]} items - An array of product ID and quantity pairs to decrement.
   * @returns {Promise<void>} A promise that resolves once all stock updates are complete.
   */
  async decreaseStock(
    items: { productId: string; quantity: number }[],
  ): Promise<void> {
    for (const item of items) {
      await this.client.send(
        new UpdateCommand({
          TableName: 'Products',
          Key: { _id: item.productId },
          UpdateExpression: 'SET #stock = #stock - :qty',
          ExpressionAttributeNames: {
            '#stock': 'stock',
          },
          ExpressionAttributeValues: {
            ':qty': item.quantity,
          },
        }),
      );
    }
  }
}
