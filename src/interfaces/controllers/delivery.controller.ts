import { Controller, Get } from '@nestjs/common';

import { GetDeliveriesUseCase } from '../../application/use-cases/get-deliveries.use-case';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly getDeliveriesUseCase: GetDeliveriesUseCase) {}

  @Get("getAll")
  async findAll() {
    const result = await this.getDeliveriesUseCase.execute();
    return result.success ? result.data : { error: result.error };
  }
}
