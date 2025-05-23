import { ProductEntity } from 'src/domain/entities/product.entity';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';

export class GetProductsUseCase {
  constructor(private readonly productRepo: ProductRepositoryPort) {}

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
