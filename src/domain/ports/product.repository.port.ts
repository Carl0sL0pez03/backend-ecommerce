import { ProductEntity } from '../entities';

export interface ProductRepositoryPort {
  findAll(): Promise<ProductEntity[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
  assignToCustomer(
    orderId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<void>;
  decreaseStock(
    items: { productId: string; quantity: number }[],
  ): Promise<void>;
}
