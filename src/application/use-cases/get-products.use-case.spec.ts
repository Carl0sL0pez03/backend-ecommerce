import { GetProductsUseCase } from './get-products.use-case';
import { ProductEntity } from '../../domain/entities';

describe('GetProductsUseCase', () => {
  const mockProductRepo = {
    findAll: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it('should return products successfully', async () => {
    const mockProducts = [
      new ProductEntity('1', 'Product A', 1000, 5, 'url-a'),
      new ProductEntity('2', 'Product B', 2000, 3, 'url-b'),
    ];

    mockProductRepo.findAll.mockResolvedValue(mockProducts);

    const useCase = new GetProductsUseCase(mockProductRepo as any);
    const result = await useCase.execute();

    expect(result).toEqual({ success: true, data: mockProducts });
    expect(mockProductRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return error when repository fails', async () => {
    mockProductRepo.findAll.mockRejectedValue(new Error('DB error'));

    const useCase = new GetProductsUseCase(mockProductRepo as any);
    const result = await useCase.execute();

    expect(result).toEqual({ success: false, error: 'DB error' });
    expect(mockProductRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
