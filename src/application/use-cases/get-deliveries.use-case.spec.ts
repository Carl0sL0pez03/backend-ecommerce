import { GetDeliveriesUseCase } from './get-deliveries.use-case';
import { DeliveryEntity } from '../../domain/entities';

describe('GetDeliveriesUseCase', () => {
  const mockDeliveryRepo = {
    findAllWithProductNames: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return deliveries successfully', async () => {
    const mockDeliveries = [
      new DeliveryEntity('d1', '2025-05-01', 'o1', 'p1', 2, 'Monitor'),
    ];
    mockDeliveryRepo.findAllWithProductNames.mockResolvedValue(mockDeliveries);

    const useCase = new GetDeliveriesUseCase(mockDeliveryRepo as any);
    const result = await useCase.execute();

    expect(result).toEqual({ success: true, data: mockDeliveries });
  });

  it('should return error when repository fails', async () => {
    mockDeliveryRepo.findAllWithProductNames.mockRejectedValue(
      new Error('DB error'),
    );

    const useCase = new GetDeliveriesUseCase(mockDeliveryRepo as any);
    const result = await useCase.execute();

    expect(result).toEqual({
      success: false,
      error: 'DB error',
    });
  });
});
