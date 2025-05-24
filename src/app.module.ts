import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import {
  DeliveryController,
  ProductController,
  TransactionController,
} from './interfaces/controllers';
import {
  GetProductsUseCase,
  ProcessOrderUseCase,
  UpdateProductUseCase,
  GetDeliveriesUseCase,
  GetTransactionsUseCase,
} from './application/use-cases';
import {
  DynammoDBProductRepository,
  DynamoDBDeliveryRepository,
  DynamoDBTransactionRepository,
} from './infrastructure/dynamodb';
import { WompiGatewayAdapter } from './infrastructure/external/wompi.gateway.adapter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductController, TransactionController, DeliveryController],
  providers: [
    {
      provide: 'ProductRepositoryPort',
      useClass: DynammoDBProductRepository,
    },
    {
      provide: 'TransactionRepositoryPort',
      useClass: DynamoDBTransactionRepository,
    },
    {
      provide: 'PaymentGatewayPort',
      useClass: WompiGatewayAdapter,
    },
    {
      provide: 'DeliveryRepositoryPort',
      useClass: DynamoDBDeliveryRepository,
    },
    ProcessOrderUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    GetDeliveriesUseCase,
    GetTransactionsUseCase,
  ],
})
export class AppModule {}
