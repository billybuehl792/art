import { pool } from "../db/pool";
import type {
  Project,
  ProjectListRequestParams,
  ProjectCreateBody,
} from "../types/projects";

export const createProject = async (body: ProjectCreateBody) => {
  const result = await pool.query<Project>(
    `
      INSERT INTO projects (
        title,
        description,
        type,
        sort_order
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        title,
        description,
        type,
        sort_order AS "sortOrder",
        created_at AS "createdAt"
    `,
    [body.title, body.description ?? null, body.type, body.sortOrder],
  );

  return result.rows[0];
};

export const getProjects = async (params: ProjectListRequestParams) => {
  const { page, limit, type } = params;

  const values: unknown[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const limitParam = values.length + 1;
  const offsetParam = values.length + 2;

  values.push(limit);
  values.push((page - 1) * limit);

  const result = await pool.query<Project>(
    `
      SELECT
        id,
        title,
        type,
        description,
        sort_order AS "sortOrder",
        created_at AS "createdAt"
      FROM projects
      ${where}
      ORDER BY sort_order ASC, created_at DESC
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `,
    values,
  );

  return result.rows;
};

export const getProjectsCount = async (params: ProjectListRequestParams) => {
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (params.type) {
    values.push(params.type);
    conditions.push(`type = $${values.length}`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM projects
      ${where}
    `,
    values,
  );

  return result.rows[0].total;
};
