/**
 * Generic interface for standardized API responses.
 *
 * @template T - The type of the data returned in the response.
 */
export interface IResponse<T> {
  /**
   * Indicates whether the operation was successful.
   */
  success: boolean;

  /**
   * The data returned by the operation.
   * This can be a single item or an array of items of type T.
   */
  data?: T[] | T;

  /**
   * Optional error message if the operation failed.
   */
  error?: string;
}
