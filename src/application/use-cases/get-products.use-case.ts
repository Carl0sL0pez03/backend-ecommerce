import { Inject } from '@nestjs/common';

import { ProductEntity } from 'src/domain/entities';
import { ProductRepositoryPort } from 'src/domain/ports';

export class GetProductsUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(): Promise<{
    success: boolean;
    data?: ProductEntity[];
    error?: string;
  }> {
    try {
      const products = await this.productRepo.findAll();
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve products.' };
    }
  }
}
