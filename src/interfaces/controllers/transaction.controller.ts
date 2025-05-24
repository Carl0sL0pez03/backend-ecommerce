import { Body, Controller, Get, Post } from '@nestjs/common';

import { IOrderParams } from 'src/application/model/IOrderParams.model';
import {
  GetTransactionsUseCase,
  ProcessOrderUseCase,
} from 'src/application/use-cases';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly processOrderUseCase: ProcessOrderUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @Get('getAll')
  async findAll() {
    const result = await this.getTransactionsUseCase.execute();
    return result.success ? result.data : { error: result.error };
  }

  @Post('create')
  async create(@Body() order: IOrderParams) {
    const result = await this.processOrderUseCase.execute(order);
    if (result.success) return result.data;
    return { error: result.error };
  }
}
