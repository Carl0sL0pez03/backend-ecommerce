import { ProductEntity } from '../entities';

export interface ProductRepositoryPort {
  findAll(): Promise<ProductEntity[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
  decreaseStock(
    items: { productId: string; quantity: number }[],
  ): Promise<void>;
}
