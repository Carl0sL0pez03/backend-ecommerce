import { Inject } from '@nestjs/common';

import { DeliveryEntity } from 'src/domain/entities';
import { DeliveryRepositoryPort } from 'src/domain/ports';

export class GetDeliveriesUseCase {
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

  async execute(): Promise<{
    success: boolean;
    data?: DeliveryEntity[];
    error?: string;
  }> {
    try {
      const deliveries = await this.deliveryRepo.findAllWithProductNames();
      return { success: true, data: deliveries };
    } catch (error) {
      return {
        success: false,
        error: 'Error retrieving deliveries',
      };
    }
  }
}
