const sendMock = jest.fn();

jest.mock('../function/auxDynamoDb.function', () => ({
  createClientDynamo: () => ({
    send: sendMock,
  }),
  getProductName: (id: string, map: Map<string, string>) =>
    map.get(id) ?? 'Desconocido',
}));

import { DeliveryEntity } from '../../domain/entities';
import { DynamoDBDeliveryRepository } from './devilery.repository.adapter';

describe('DynamoDBDeliveryRepository', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return deliveries with product names', async () => {
    sendMock
      .mockResolvedValueOnce({
        Items: [
          {
            deliveryId: 'd1',
            orderId: 'o1',
            productId: 'p1',
            quantity: 2,
            deliveredAt: '2025-05-01T12:00:00Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        Responses: {
          Products: [{ _id: 'p1', name: 'Monitor Gamer' }],
        },
      });

    const repo = new DynamoDBDeliveryRepository();
    const result = await repo.findAllWithProductNames();

    expect(result).toEqual([
      new DeliveryEntity(
        'd1',
        '2025-05-01T12:00:00Z',
        'o1',
        'p1',
        2,
        'Monitor Gamer',
      ),
    ]);
  });

  it('should call PutCommand for each item in assignToCustomer', async () => {
    sendMock.mockResolvedValue(undefined);

    const repo = new DynamoDBDeliveryRepository();
    await repo.assignToCustomer('o1', [
      { productId: 'p1', quantity: 1 },
      { productId: 'p2', quantity: 2 },
    ]);

    expect(sendMock).toHaveBeenCalledTimes(2);
  });
});
