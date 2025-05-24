import { Inject } from '@nestjs/common';

import { DeliveryEntity } from '../../domain/entities';
import { DeliveryRepositoryPort } from '../../domain/ports';
import { IResponse } from '../model/IResponse.model';

export class GetDeliveriesUseCase {
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

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
