import { TransactionStatus } from '../enum/TransactionStatus.enum';

export class TransactionEntity {
  constructor(
    public readonly _id: string,
    public readonly customer: { name: string; address: string; city: string },
    public readonly payment: { maskedCard: string; expiry: string },
    public readonly items: { productId: string; quantity: number; }[],
    public readonly total: number,
    public status: TransactionStatus,
    public wompiId?: string,
    public result?: any,
  ) {}
}
