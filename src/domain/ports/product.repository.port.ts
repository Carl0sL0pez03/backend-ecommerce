import { ProductEntity } from '../entities/product.entity';

export interface ProductRepositoryPort {
  findAll(): Promise<ProductEntity[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
}
