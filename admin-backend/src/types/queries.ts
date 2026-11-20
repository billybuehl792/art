export interface SelectQueryOptions {
  table: string;
  columns?: string;
  where?: Record<string, unknown>;
  search?: { columns: string[]; value: string };
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export interface InsertQueryOptions {
  table: string;
  data: Record<string, unknown>;
  returning?: string;
}

export interface UpdateQueryOptions {
  table: string;
  data: Record<string, unknown>;
  where: Record<string, unknown>;
  returning?: string;
}

export interface DeleteQueryOptions {
  table: string;
  where: Record<string, unknown>;
}
