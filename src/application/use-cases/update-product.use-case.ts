import { Inject } from '@nestjs/common';

import { ProductEntity } from 'src/domain/entities';
import { ProductRepositoryPort } from 'src/domain/ports';

export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  async execute(input: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    urlImg: string;
  }): Promise<{ success: boolean; data?: ProductEntity; error?: string }> {
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
    } catch (e) {
      return { success: false, error: 'Failed to update product.' };
    }
  }
}
