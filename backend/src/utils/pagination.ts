import type { Request } from "express";
import type { ListRequestParams, ListResponse } from "../types/pagination";
import type { Item } from "../types/basic";

export function getListRequestParams(
  req: Request<{}, {}, {}, ListRequestParams>,
  defaultLimit = 10,
): ListRequestParams {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(1, Number(req.query.limit) || defaultLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function getListResponse<T extends Item = Item>(
  params: ListRequestParams,
  results: T[],
  total: number,
): ListResponse<T> {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
    results,
  };
}
