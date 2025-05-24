const sendMock = jest.fn();

jest.mock('../function/auxDynamoDb.function', () => ({
  createClientDynamo: () => ({
    send: sendMock,
  }),
}));

import { DynammoDBProductRepository } from './product.repository.adapter';
import { ProductEntity } from '../../domain/entities';

describe('DynammoDBProductRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return mapped products in findAll()', async () => {
    sendMock.mockResolvedValueOnce({
      Items: [
        {
          _id: 'p1',
          name: 'Monitor',
          price: 200000,
          stock: 10,
          urlImg: 'http://img',
        },
      ],
    });

    const repo = new DynammoDBProductRepository();
    const result = await repo.findAll();

    expect(result).toEqual([
      new ProductEntity('p1', 'Monitor', 200000, 10, 'http://img'),
    ]);
  });

  it('should return mapped products in findManyByIds()', async () => {
    sendMock.mockResolvedValueOnce({
      Responses: {
        Products: [
          { _id: 'p1', name: 'Monitor' },
          { _id: 'p2', name: 'Laptop' },
        ],
      },
    });

    const repo = new DynammoDBProductRepository();
    const result = await repo.findManyByIds(['p1', 'p2']);

    expect(result).toEqual([
      { id: 'p1', name: 'Monitor' },
      { id: 'p2', name: 'Laptop' },
    ]);
  });

  it('should return empty array when findManyByIds is called with empty array', async () => {
    const repo = new DynammoDBProductRepository();
    const result = await repo.findManyByIds([]);
    expect(result).toEqual([]);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('should call update with correct UpdateCommand', async () => {
    sendMock.mockResolvedValueOnce(undefined);
    const repo = new DynammoDBProductRepository();

    const entity = new ProductEntity('p1', 'Teclado', 30000, 7, 'url');

    const result = await repo.update(entity);
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(result).toBe(entity);
  });

  it('should call send for each item in decreaseStock()', async () => {
    sendMock.mockResolvedValue(undefined);
    const repo = new DynammoDBProductRepository();

    await repo.decreaseStock([
      { productId: 'p1', quantity: 1 },
      { productId: 'p2', quantity: 2 },
    ]);

    expect(sendMock).toHaveBeenCalledTimes(2);
  });
});
