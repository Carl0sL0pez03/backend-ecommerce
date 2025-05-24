import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TranslateConfig } from '@aws-sdk/lib-dynamodb';

export function createClientDynamo(
  translateConfig?: TranslateConfig,
): DynamoDBDocumentClient {
  const baseClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  return DynamoDBDocumentClient.from(baseClient, translateConfig);
}

export function getProductName(
  productId: string,
  productMap: Map<string, string>,
): string {
  return productMap.get(productId) || 'Desconocido';
}
