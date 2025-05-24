export class DeliveryEntity {
  constructor(
    public readonly deliveryId: string,
    public readonly deliveredAt: string,
    public readonly orderId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly productName?: string, 
  ) {}
}
