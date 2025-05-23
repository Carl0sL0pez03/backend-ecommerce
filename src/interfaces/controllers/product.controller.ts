import { Body, Controller, Get, Put } from '@nestjs/common';

import {
  GetProductsUseCase,
  UpdateProductUseCase,
} from 'src/application/use-cases';
import { DynammoDBProductRepository } from 'src/infrastructure/dynamodb/product.repository.adapter';

@Controller('products')
export class ProductController {
  private readonly getProductsUseCase: GetProductsUseCase;
  private readonly updateProductUseCase: UpdateProductUseCase;

  constructor() {
    const productRepo = new DynammoDBProductRepository();
    this.getProductsUseCase = new GetProductsUseCase(productRepo);
    this.updateProductUseCase = new UpdateProductUseCase(productRepo);
  }

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
