import { Inject } from '@nestjs/common';

import { ProductEntity } from '../../domain/entities';
import { ProductRepositoryPort } from '../../domain/ports';
import { IResponse } from '../model/IResponse.model';
import { IProductRaw } from '../../interfaces/model/ITransaction.model';

/**
 * Use case responsible for updating an existing product.
 *
 * This class encapsulates the logic to map raw input data into a domain entity
 * and delegate the persistence update to the product repository port.
 */
export class UpdateProductUseCase {
  /**
   * Constructs the UpdateProductUseCase with a dependency on the product repository.
   *
   * @param {ProductRepositoryPort} productRepo - Port to handle product data persistence.
   */
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  /**
   * Executes the product update use case.
   *
   * @param {IProductRaw} input - The raw product data to be updated.
   * @returns {Promise<IResponse<ProductEntity>>} A response containing the updated product entity or an error message.
   */
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
