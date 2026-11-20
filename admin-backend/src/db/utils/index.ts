import pool from "../pool";
import type {
  DeleteQueryOptions,
  InsertQueryOptions,
  SelectQueryOptions,
  UpdateQueryOptions,
} from "../../types/queries";

export const checkDbConnection = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT
        current_database() AS database,
        current_user AS user,
        current_schema() AS schema,
        inet_server_addr() AS host,
        inet_server_port() AS port
    `);

    console.log("Database connection successful:\n", result.rows[0]);
  } finally {
    client.release();
  }
};

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

export const buildInsertQuery = (body: InsertQueryOptions) => {
  const { table, data, returning = "*" } = body;

  const columns: string[] = [];
  const values: unknown[] = [];
  Object.entries(data).forEach(([column, value], index) => {
    if (value !== undefined) {
      columns.push(column);
      values.push(value);
    }
  });

  const placeholders = values.map((_, i) => `$${i + 1}`);

  const query = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING ${returning}
  `;

  return { query, values };
};

export const buildUpdateQuery = (body: UpdateQueryOptions) => {
  const { table, data, where, returning = "*" } = body;

  const columns: string[] = [];
  const values: unknown[] = [];
  Object.entries(data).forEach(([column, value], index) => {
    if (value !== undefined) {
      columns.push(`${column} = $${index + 1}`);
      values.push(value);
    }
  });

  if (!values.length) throw new Error("No fields provided for update");

  const { whereClause, values: whereValues } = buildWhereQueryClause(
    { where },
    values.length,
  );
  if (!whereClause) throw new Error("WHERE conditions are required");

  values.push(...whereValues);

  const query = `
    UPDATE ${table}
    SET ${columns.join(", ")}, updated_at = NOW()
    ${whereClause}
    RETURNING ${returning ?? "*"}
  `;

  return { query, values };
};

export const buildDeleteQuery = ({ table, where }: DeleteQueryOptions) => {
  const { whereClause, values } = buildWhereQueryClause({ where });
  if (!whereClause) throw new Error("WHERE conditions are required");

  const query = `DELETE FROM ${table} ${whereClause}`;

  return { query, values };
};
