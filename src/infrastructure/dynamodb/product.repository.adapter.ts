import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ProductEntity } from 'src/domain/entities/product.entity';

import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';

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
}
