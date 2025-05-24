import { Body, Controller, Get, Put } from '@nestjs/common';

import {
  GetProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases';
import { IProductRaw } from '../model/ITransaction.model';

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
    body: IProductRaw,
  ) {
    const result = await this.updateProductUseCase.execute(body);
    if (result.success) return result.data;
    return { error: result.error };
  }
}
