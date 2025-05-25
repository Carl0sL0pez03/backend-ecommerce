import { ProductEntity } from '../entities';
import {
  IParamsDecreaseStock,
  IResponseFindManyByIds,
} from '../model/IAuxPorts.model';

/**
 * Port interface for product-related persistence operations.
 *
 * This abstraction allows interaction with the product storage layer (e.g., database)
 * without coupling the domain logic to a specific implementation.
 */
export interface ProductRepositoryPort {
  /**
   * Retrieves all available products from the data source.
   *
   * @returns {Promise<ProductEntity[]>} A promise that resolves to an array of product entities.
   */
  findAll(): Promise<ProductEntity[]>;

  /**
   * Finds multiple products by their IDs and returns a simplified structure.
   *
   * @param {string[]} ids - The list of product IDs to retrieve.
   * @returns {Promise<IResponseFindManyByIds[]>} A promise that resolves to an array of product IDs and names.
   */
  findManyByIds(ids: string[]): Promise<IResponseFindManyByIds[]>;

  /**
   * Updates the data of a given product.
   *
   * @param {ProductEntity} product - The product entity to update.
   * @returns {Promise<ProductEntity>} A promise that resolves to the updated product entity.
   */
  update(product: ProductEntity): Promise<ProductEntity>;

  /**
   * Decreases the stock quantity for a list of products.
   *
   * @param {IParamsDecreaseStock[]} items - The list of product IDs and the quantities to reduce.
   * @returns {Promise<void>} A promise that resolves when the stock update is complete.
   */
  decreaseStock(items: IParamsDecreaseStock[]): Promise<void>;
}
