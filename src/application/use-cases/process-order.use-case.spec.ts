import { transactionStatus } from '../../domain/enum/transactionStatus.enum';
import { ProcessOrderUseCase } from './process-order.use-case';

describe('ProcessOrderUseCase', () => {
  const mockTransactionRepo = {
    create: jest.fn(),
    updateStatus: jest.fn(),
  };

  const mockPaymentGateway = {
    charge: jest.fn(),
  };

  const mockProductRepo = {
    decreaseStock: jest.fn(),
  };

  const mockDeliveryRepo = {
    assignToCustomer: jest.fn(),
  };

  it('should process a transaction successfully', async () => {
    mockTransactionRepo.create.mockResolvedValue(undefined);
    mockPaymentGateway.charge.mockResolvedValue({
      success: true,
      result: { data: { transactionId: '123' } },
    });
    mockTransactionRepo.updateStatus.mockResolvedValue(undefined);
    mockDeliveryRepo.assignToCustomer.mockResolvedValue(undefined);
    mockProductRepo.decreaseStock.mockResolvedValue(undefined);

    const useCase = new ProcessOrderUseCase(
      mockTransactionRepo as any,
      mockPaymentGateway as any,
      mockProductRepo as any,
      mockDeliveryRepo as any,
    );

    const result = await useCase.execute({
      customer: {
        name: 'Test',
        address: 'Street',
        city: 'City',
        email: 'a@b.com',
      },
      payment: {
        cardNumber: '4111111111111111',
        expiry: '12/25',
        cvc: '123',
        cardHolder: 'John Doe',
        installments: 1,
      },
      items: [{ productId: 'p1', quantity: 1 }],
      total: 1000,
    });

    expect(result.success).toBe(true);
    expect(mockTransactionRepo.updateStatus).toHaveBeenCalledWith(
      expect.any(String),
      transactionStatus.COMPLETED,
      { transactionId: '123' },
    );
  });

  it('should handle failed payment', async () => {
    mockTransactionRepo.create.mockResolvedValue(undefined);
    mockPaymentGateway.charge.mockResolvedValue({
      success: false,
      result: { error: 'Card declined' },
    });

    const useCase = new ProcessOrderUseCase(
      mockTransactionRepo as any,
      mockPaymentGateway as any,
      mockProductRepo as any,
      mockDeliveryRepo as any,
    );

    const result = await useCase.execute({
      customer: {
        name: 'Test',
        address: 'Street',
        city: 'City',
        email: 'a@b.com',
      },
      payment: {
        cardNumber: '4111111111111111',
        expiry: '12/25',
        cvc: '123',
        cardHolder: 'John Doe',
        installments: 1,
      },
      items: [{ productId: 'p1', quantity: 1 }],
      total: 1000,
    });

    expect(result.success).toBe(false);
    expect(result.error).toEqual({ error: 'Card declined' });
  });

  it('should handle unexpected errors', async () => {
    mockTransactionRepo.create.mockRejectedValue(new Error('DB down'));

    const useCase = new ProcessOrderUseCase(
      mockTransactionRepo as any,
      mockPaymentGateway as any,
      mockProductRepo as any,
      mockDeliveryRepo as any,
    );

    const result = await useCase.execute({
      customer: {
        name: 'Test',
        address: 'Street',
        city: 'City',
        email: 'a@b.com',
      },
      payment: {
        cardNumber: '4111111111111111',
        expiry: '12/25',
        cvc: '123',
        cardHolder: 'John Doe',
        installments: 1,
      },
      items: [{ productId: 'p1', quantity: 1 }],
      total: 1000,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB down');
  });
});
