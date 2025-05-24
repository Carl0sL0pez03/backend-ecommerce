import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { ProductEntity } from '../../domain/entities';
import { ProductRepositoryPort } from '../../domain/ports';
import { createClientDynamo } from '../function/auxDynamoDb.function';

export class DynammoDBProductRepository implements ProductRepositoryPort {
  private client: DynamoDBDocumentClient;

  constructor() {
    this.client = createClientDynamo();
  }

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
