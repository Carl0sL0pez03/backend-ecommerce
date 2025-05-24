import { DynamoDBDeliveryRepository } from './devilery.repository.adapter';
import { DynamoDBTransactionRepository } from './transaction.repository.adapter';
import { DynammoDBProductRepository } from 'src/infrastructure/dynamodb/product.repository.adapter';

export {
  DynammoDBProductRepository,
  DynamoDBTransactionRepository,
  DynamoDBDeliveryRepository,
};
