import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import {
  ProductController,
  TransactionController,
} from './interfaces/controllers';
import {
  GetProductsUseCase,
  ProcessOrderUseCase,
  UpdateProductUseCase,
} from './application/use-cases';
import {
  DynammoDBProductRepository,
  DynamoDBTransactionRepository,
} from './infrastructure/dynamodb';
import { WompiGatewayAdapter } from './infrastructure/external/wompi.gateway.adapter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductController, TransactionController],
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
    ProcessOrderUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
  ],
})
export class AppModule {}
