import { GetTransactionsUseCase } from './get-transactions.use-case';
import { TransactionEntity } from '../../domain/entities';
import { transactionStatus } from '../../domain/enum/transactionStatus.enum';

describe('GetTransactionsUseCase', () => {
  const mockTransactionRepo = {
    findAll: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should return filtered transactions successfully', async () => {
    const mockTransactions = [
      new TransactionEntity(
        '1',
        { name: 'John', address: '123 Street', city: 'City' },
        { maskedCard: '****1234', expiry: '12/25' },
        [
          { productId: 'p1', quantity: 1 },
          { productId: 'p2', quantity: 2 },
        ],
        3000,
        transactionStatus.COMPLETED,
        'txn_123',
        {
          payment_method: {
            installments: 3,
            type: 'CARD',
          },
          status: 'APPROVED',
        },
      ),
    ];

    mockTransactionRepo.findAll.mockResolvedValue(mockTransactions);

    const useCase = new GetTransactionsUseCase(mockTransactionRepo as any);
    const result = await useCase.execute();

    expect(result.success).toBe(true);
    expect(result.data).toEqual([
      {
        customer: mockTransactions[0].customer,
        items: mockTransactions[0].items,
        total: mockTransactions[0].total,
        status: mockTransactions[0].status,
        result: {
          payment_method: {
            installments: 3,
            type: 'CARD',
          },
          status: 'APPROVED',
        },
      },
    ]);
    expect(mockTransactionRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return error if findAll throws', async () => {
    mockTransactionRepo.findAll.mockRejectedValue(new Error('DB Error'));

    const useCase = new GetTransactionsUseCase(mockTransactionRepo as any);
    const result = await useCase.execute();

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB Error');
    expect(mockTransactionRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
