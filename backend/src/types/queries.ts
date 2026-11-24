export interface SelectQueryOptions {
  table: string;
  columns?: string;
  where?: Record<string, unknown>;
  search?: { columns: string[]; value: string };
  orderBy?: string;
  limit?: number;
  offset?: number;
}
