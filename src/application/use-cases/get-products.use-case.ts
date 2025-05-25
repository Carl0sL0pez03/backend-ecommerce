import { Inject } from '@nestjs/common';

import { ProductEntity } from '../../domain/entities';
import { ProductRepositoryPort } from '../../domain/ports';
import { IResponse } from '../model/IResponse.model';

/**
 * Use case for retrieving all products.
 *
 * This class is part of the Application layer following the Hexagonal Architecture (Ports & Adapters),
 * and uses the injected ProductRepositoryPort to access product data.
 */
export class GetProductsUseCase {
  /**
   * Constructs the GetProductsUseCase with the required product repository port.
   *
   * @param {ProductRepositoryPort} productRepo - The repository interface for accessing products.
   */
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepo: ProductRepositoryPort,
  ) {}

  /**
   * Executes the use case to retrieve all available products.
   *
   * @returns {Promise<IResponse<ProductEntity>>} A response object containing the list of products,
   * or an error message if the operation fails.
   */
  async execute(): Promise<IResponse<ProductEntity>> {
    try {
      const products = await this.productRepo.findAll();
      return { success: true, data: products };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Failed to retrieve products.',
      };
    }
  }
}
