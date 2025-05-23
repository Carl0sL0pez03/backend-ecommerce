export class ProductEntity {
  constructor(
    public readonly _id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly urlImg: string,
  ) {}
}
