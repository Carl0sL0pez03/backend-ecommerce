import { ProductEntity } from '../entities';
import {
  IParamsDecreaseStock,
  IResponseFindManyByIds,
} from '../model/IAuxPorts.model';

export interface ProductRepositoryPort {
  findAll(): Promise<ProductEntity[]>;
  findManyByIds(ids: string[]): Promise<IResponseFindManyByIds[]>;
  update(product: ProductEntity): Promise<ProductEntity>;
  decreaseStock(items: IParamsDecreaseStock[]): Promise<void>;
}
