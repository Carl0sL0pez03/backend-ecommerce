import { Body, Controller, Get, Put } from '@nestjs/common';

import {
  GetProductsUseCase,
  UpdateProductUseCase,
} from 'src/application/use-cases';
import { DynammoDBProductRepository } from 'src/infrastructure/dynamodb';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Get('getAll')
  async getAll() {
    const result = await this.getProductsUseCase.execute();
    if (result.success) {
      return result.data;
    }
    return { error: result.error };
  }

  @Put('updateProduct')
  async updateProduct(
    @Body()
    body: {
      _id: string;
      name: string;
      price: number;
      stock: number;
      urlImg: string;
    },
  ) {
    const result = await this.updateProductUseCase.execute(body);
    if (result.success) return result.data;
    return { error: result.error };
  }
}
