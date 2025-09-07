export interface PagedResult<T> {
  items: T[];
  totalItemsCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  pageNumber: number;
  pageSize: number;
}
