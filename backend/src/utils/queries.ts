import type { SelectQueryOptions } from "../types/queries";

export const buildWhereQueryClause = (
  options: Pick<SelectQueryOptions, "where" | "search">,
  parameterOffset = 0,
) => {
  const values: unknown[] = [];
  const conditions: string[] = [];

  for (const [column, value] of Object.entries(options.where ?? {})) {
    if (value === undefined) continue;
    if (value === null) {
      conditions.push(`${column} IS NULL`);
      continue;
    }

    values.push(value);
    conditions.push(`${column} = $${parameterOffset + values.length}`);
  }

  if (options.search?.value.trim() && options.search.columns.length > 0) {
    values.push(`%${options.search.value.trim()}%`);
    conditions.push(
      `(${options.search.columns
        .map((column) => `${column} ILIKE $${parameterOffset + values.length}`)
        .join(" OR ")})`,
    );
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  return { whereClause, values };
};

export const buildSelectQuery = (body: SelectQueryOptions) => {
  const { whereClause, values } = buildWhereQueryClause(body);

  const orderByClause = body.orderBy ? `ORDER BY ${body.orderBy}` : "";

  let limitClause = "";
  let offsetClause = "";

  if (body.limit !== undefined) {
    values.push(body.limit);
    limitClause = `LIMIT $${values.length}`;
  }

  if (body.offset !== undefined) {
    values.push(body.offset);
    offsetClause = `OFFSET $${values.length}`;
  }

  const query = `
    SELECT ${body.columns ?? "*"}
    FROM ${body.table}
    ${whereClause}
    ${orderByClause}
    ${limitClause}
    ${offsetClause}
  `;

  return { query, values };
};
