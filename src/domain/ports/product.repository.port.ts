import { ProductEntity } from '../entities';

export interface ProductRepositoryPort {
  findAll(): Promise<ProductEntity[]>;
  findManyByIds(ids: string[]): Promise<{ id: string; name: string }[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
  decreaseStock(
    items: { productId: string; quantity: number }[],
  ): Promise<void>;
}
