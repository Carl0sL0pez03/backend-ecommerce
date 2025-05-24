import { Body, Controller, Post } from '@nestjs/common';

import { ProcessOrderUseCase } from 'src/application/use-cases';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly processOrderUseCase: ProcessOrderUseCase) {}

  @Post('create')
  async create(@Body() order: any) {
    const result = await this.processOrderUseCase.execute(order);
    if (result.success) return result.data;
    return { error: result.error };
  }
}
