import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { ProductEntity } from 'src/domain/entities';
import { ProductRepositoryPort } from 'src/domain/ports';

export class DynammoDBProductRepository implements ProductRepositoryPort {
  private client: DynamoDBDocumentClient;

  constructor() {
    const dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
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
