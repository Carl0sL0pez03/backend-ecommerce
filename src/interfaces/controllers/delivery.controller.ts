import { Controller, Get } from '@nestjs/common';

import { GetDeliveriesUseCase } from '../../application/use-cases/get-deliveries.use-case';

/**
 * Controller responsible for handling delivery-related HTTP requests.
 */
@Controller('deliveries')
export class DeliveryController {
  /**
   * Creates an instance of DeliveryController.
   *
   * @param {GetDeliveriesUseCase} getDeliveriesUseCase - Use case for retrieving deliveries with product names.
   */
  constructor(private readonly getDeliveriesUseCase: GetDeliveriesUseCase) {}

  /**
   * GET /deliveries/getAll
   *
   * Retrieves all deliveries along with their product names.
   *
   * @returns A list of DeliveryEntity or an error object.
   */
  @Get('getAll')
  async findAll() {
    const result = await this.getDeliveriesUseCase.execute();
    return result.success ? result.data : { error: result.error };
  }
}
