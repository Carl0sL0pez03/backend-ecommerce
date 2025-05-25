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

/**
 * AppModule is the root module of the application.
 *
 * It sets up the configuration module globally and registers all controllers and providers
 * required by the application. It follows the Hexagonal Architecture pattern using Ports and Adapters.
 *
 * ## Controllers
 * - `ProductController`: Handles product-related HTTP endpoints.
 * - `TransactionController`: Handles transaction processing and listing.
 * - `DeliveryController`: Handles delivery-related endpoints.
 *
 * ## Providers (Dependency Injection)
 * - Binds each repository port to its corresponding infrastructure adapter.
 * - Registers all use cases used by the controllers.
 */
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
