import { UpdateProductUseCase } from './update-product.use-case';
import { ProductEntity } from '../../domain/entities';
import { IProductRaw } from '../../interfaces/model/ITransaction.model';

describe('UpdateProductUseCase', () => {
  const mockProductRepo = {
    update: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  const mockInput: IProductRaw = {
    _id: 'p1',
    name: 'Laptop Gamer',
    price: 5000000,
    stock: 11,
    urlImg: 'https://img.url/product.jpg',
  };

  const mockEntity = new ProductEntity(
    mockInput._id,
    mockInput.name,
    mockInput.price,
    mockInput.stock,
    mockInput.urlImg,
  );

  it('should update the product successfully', async () => {
    mockProductRepo.update.mockResolvedValue(mockEntity);

    const useCase = new UpdateProductUseCase(mockProductRepo as any);
    const result = await useCase.execute(mockInput);

    expect(result).toEqual({ success: true, data: mockEntity });
    expect(mockProductRepo.update).toHaveBeenCalledWith(expect.any(ProductEntity));
    expect(mockProductRepo.update).toHaveBeenCalledTimes(1);
  });

  it('should return error if repository throws', async () => {
    mockProductRepo.update.mockRejectedValue(new Error('Update failed'));

    const useCase = new UpdateProductUseCase(mockProductRepo as any);
    const result = await useCase.execute(mockInput);

    expect(result).toEqual({ success: false, error: 'Update failed' });
    expect(mockProductRepo.update).toHaveBeenCalledTimes(1);
  });
});
