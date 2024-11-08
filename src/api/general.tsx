export interface PaginationConfig {
  size: number;
  index: number;
}

export interface PaginatedResult<ItemType> {
  total: number;
  pagination: PaginationConfig;
  data: ItemType[];
}
