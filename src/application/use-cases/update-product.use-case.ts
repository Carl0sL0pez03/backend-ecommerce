import { ProductRepositoryPort } from '../../domain/ports/product.repository.port';
import { ProductEntity } from '../../domain/entities/product.entity';
import { error } from 'console';

export class UpdateProductUseCase {
  constructor(private readonly productRepo: ProductRepositoryPort) {}

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
      console.log("product", product);
      
      const updated = await this.productRepo.update(product);
      return { success: true, data: updated };
    } catch (e) {
      console.log(error);
      
      return { success: false, error: 'Failed to update product.' };
    }
  }
}
