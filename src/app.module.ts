import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { ProductController } from './interfaces/controllers/product.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductController],
})
export class AppModule {}
