import { DeliveryEntity } from '../entities/delivery.entity';

/**
 * Port interface for handling delivery-related persistence operations.
 *
 * This interface abstracts the data layer for delivery entities,
 * allowing different implementations (e.g., DynamoDB, MongoDB) to be used
 * without changing the domain logic.
 */
export interface DeliveryRepositoryPort {
  /**
   * Retrieves all deliveries with their associated product names.
   *
   * @returns {Promise<DeliveryEntity[]>} A promise that resolves to a list of delivery entities
   * enriched with the name of each product.
   */
  findAllWithProductNames(): Promise<DeliveryEntity[]>;
  /**
   * Assigns a set of products to a customer by creating delivery records for an order.
   *
   * @param {string} orderId - The unique identifier of the order.
   * @param {{ productId: string; quantity: number }[]} items - A list of products and their quantities to be delivered.
   * @returns {Promise<void>} A promise that resolves when the assignment is complete.
   */
  assignToCustomer(
    orderId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<void>;
}
