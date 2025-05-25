import { Body, Controller, Get, Put } from '@nestjs/common';

import {
  GetProductsUseCase,
  UpdateProductUseCase,
} from '../../application/use-cases';
import { IProductRaw } from '../model/ITransaction.model';

/**
 * Controller responsible for handling product-related HTTP requests.
 */
@Controller('products')
export class ProductController {
  /**
   * Creates an instance of ProductController.
   *
   * @param {GetProductsUseCase} getProductsUseCase - Use case for retrieving products.
   * @param {UpdateProductUseCase} updateProductUseCase - Use case for updating products.
   */
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  /**
   * GET /products/getAll
   *
   * Retrieves all products stored in the system.
   *
   * @returns A list of ProductEntity or an error object.
   */
  @Get('getAll')
  async getAll() {
    const result = await this.getProductsUseCase.execute();
    if (result.success) {
      return result.data;
    }
    return { error: result.error };
  }

  /**
   * PUT /products/updateProduct
   *
   * Updates a product with the given data.
   *
   * @param {IProductRaw} body - The raw product data to update.
   * @returns The updated product or an error object.
   */
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
