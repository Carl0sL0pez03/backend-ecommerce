import { Inject } from '@nestjs/common';

import { DeliveryEntity } from '../../domain/entities';
import { DeliveryRepositoryPort } from '../../domain/ports';
import { IResponse } from '../model/IResponse.model';

/**
 * Use case for retrieving all deliveries with their associated product names.
 *
 * This class follows the Ports & Adapters (Hexagonal Architecture) pattern and communicates
 * with the delivery repository port to fetch the data.
 */
export class GetDeliveriesUseCase {
  /**
   * Constructs the use case with a delivery repository dependency.
   *
   * @param {DeliveryRepositoryPort} deliveryRepo - The repository interface used to retrieve deliveries.
   */
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

  /**
   * Executes the use case to retrieve all deliveries with product names.
   *
   * @returns {Promise<IResponse<DeliveryEntity>>} A response object containing the delivery data
   * or an error message if the retrieval fails.
   */
  async execute(): Promise<IResponse<DeliveryEntity>> {
    try {
      const deliveries = await this.deliveryRepo.findAllWithProductNames();
      return { success: true, data: deliveries };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Error retrieving deliveries',
      };
    }
  }
}
