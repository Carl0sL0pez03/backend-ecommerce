import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, TranslateConfig } from '@aws-sdk/lib-dynamodb';

/**
 * Creates a DynamoDBDocumentClient with optional marshalling and unmarshalling configuration.
 *
 * @param {TranslateConfig} [translateConfig] - Optional configuration for how data is converted between JavaScript and DynamoDB formats.
 * @returns {DynamoDBDocumentClient} A configured instance of DynamoDBDocumentClient.
 */
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

/**
 * Retrieves the product name from a product map using the given product ID.
 *
 * @param {string} productId - The ID of the product to look up.
 * @param {Map<string, string>} productMap - A map of product IDs to product names.
 * @returns {string} The name of the product if found; otherwise, 'Desconocido'.
 */
export function getProductName(
  productId: string,
  productMap: Map<string, string>,
): string {
  return productMap.get(productId) || 'Desconocido';
}
