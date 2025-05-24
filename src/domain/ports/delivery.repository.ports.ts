import { DeliveryEntity } from '../entities/delivery.entity';

export interface DeliveryRepositoryPort {
  findAllWithProductNames(): Promise<DeliveryEntity[]>;
  assignToCustomer(
    orderId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<void>;
}
