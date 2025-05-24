import { Inject } from '@nestjs/common';

import { ProductEntity } from 'src/domain/entities';
import { ProductRepositoryPort } from 'src/domain/ports';
import { IResponse } from '../model/IResponse.model';
import { IProductRaw } from 'src/interfaces/model/ITransaction.model';

export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(input: IProductRaw): Promise<IResponse<ProductEntity>> {
    try {
      const product = new ProductEntity(
        input._id,
        input.name,
        input.price,
        input.stock,
        input.urlImg,
      );

      const updated = await this.productRepo.update(product);
      return { success: true, data: updated };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Failed to update product.',
      };
    }
  }
}
