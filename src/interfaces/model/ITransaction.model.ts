/**
 * Interface representing the raw product data structure.
 */
export interface IProductRaw {
  /**
   * Unique identifier for the product.
   */
  _id: string;

  /**
   * Name or title of the product.
   */
  name: string;

  /**
   * Price of the product in local currency (e.g., COP).
   */
  price: number;

  /**
   * Number of units available in stock.
   */
  stock: number;

  /**
   * URL of the product image.
   */
  urlImg: string;
}
