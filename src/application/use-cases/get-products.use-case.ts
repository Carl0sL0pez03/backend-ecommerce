import { Inject } from '@nestjs/common';

import { ProductEntity } from '../../domain/entities';
import { ProductRepositoryPort } from '../../domain/ports';
import { IResponse } from '../model/IResponse.model';

export class GetProductsUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(): Promise<IResponse<ProductEntity>> {
    try {
      const products = await this.productRepo.findAll();
      return { success: true, data: products };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve products.',
      };
    }
  }
}
