const sendMock = jest.fn();
const findManyByIdsMock = jest.fn();

jest.mock('../function/auxDynamoDb.function', () => ({
  createClientDynamo: () => ({
    send: sendMock,
  }),
  getProductName: (id: string, map: Map<string, string>) =>
    map.get(id) ?? 'Desconocido',
}));

import { TransactionStatus } from '../../domain/enum/TransactionStatus.enum';
import { TransactionEntity } from '../../domain/entities';
import { DynamoDBTransactionRepository } from './transaction.repository.adapter';

describe('DynamoDBTransactionRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  const mockProductRepo = {
    findManyByIds: findManyByIdsMock,
  };

  it('should return mapped transactions with product names', async () => {
    sendMock.mockResolvedValueOnce({
      Items: [
        {
          _id: 'txn1',
          customer: { name: 'Ana', address: 'Calle 1', city: 'Bogotá' },
          payment: { maskedCard: '****1234', expiry: '12/25' },
          items: [{ productId: 'p1', quantity: 1 }],
          total: 3000,
          status: 'COMPLETED',
          wompiId: 'w123',
          result: {},
        },
      ],
    });

    findManyByIdsMock.mockResolvedValueOnce([{ id: 'p1', name: 'Laptop' }]);

    const repo = new DynamoDBTransactionRepository(mockProductRepo as any);
    const result = await repo.findAll();

    expect(result.length).toBe(1);
    expect(result[0].items[0]?.['productName']).toBe('Laptop');
  });

  it('should create a transaction with createdAt field', async () => {
    sendMock.mockResolvedValue(undefined);

    const txn = new TransactionEntity(
      'txn1',
      { name: 'Carlos', address: 'Cra 5', city: 'Medellín' },
      { maskedCard: '****5678', expiry: '11/24' },
      [{ productId: 'p2', quantity: 2 }],
      5000,
      TransactionStatus.PENDING,
    );

    const repo = new DynamoDBTransactionRepository(mockProductRepo as any);
    const result = await repo.create(txn);

    expect(result).toBe(txn);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it('should update transaction status and result', async () => {
    sendMock.mockResolvedValue(undefined);

    const repo = new DynamoDBTransactionRepository(mockProductRepo as any);
    await repo.updateStatus('txn1', 'FAILED', { error: 'declined' });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: 'Transactions',
          Key: { _id: 'txn1' },
        }),
      }),
    );
  });
});
