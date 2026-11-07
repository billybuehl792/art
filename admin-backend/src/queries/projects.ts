import { pool } from "../db";
import { DB_PROJECT, DB_PROJECTS } from "../constants/projects";
import {
  projectColumnCreateSchema,
  projectColumnUpdateSchema,
} from "../schemas/projects";
import type { Id } from "../types/basic";
import type {
  Project,
  ProjectListRequestParams,
  ProjectCreate,
  ProjectUpdate,
} from "../types/projects";

export const getProject = async (id: Id) => {
  const query = `SELECT ${DB_PROJECT} FROM ${DB_PROJECTS} WHERE id = $1 LIMIT 1`;
  const result = await pool.query<Project>(query, [id]);

  return result.rows[0];
};

export const getProjects = async (params: ProjectListRequestParams) => {
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (params.category) {
    values.push(params.category);
    conditions.push(`category = $${values.length}`);
  }

  if (params.search) {
    values.push(`%${params.search.trim()}%`);
    conditions.push(`
      (
        title ILIKE $${values.length}
        OR subtitle ILIKE $${values.length}
        OR description ILIKE $${values.length}
      )
    `);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderBy = "ORDER BY sort_order ASC, created_at DESC";
  const limit = `LIMIT $${values.length + 1}`;
  const offset = `OFFSET $${values.length + 2}`;

  values.push(params.limit);
  values.push((params.page - 1) * params.limit);

  const query = `SELECT ${DB_PROJECT} FROM ${DB_PROJECTS} ${where} ${orderBy} ${limit} ${offset}`;
  const result = await pool.query<Project>(query, values);

  return result.rows;
};

export const getProjectsCount = async (params: ProjectListRequestParams) => {
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (params.category) {
    values.push(params.category);
    conditions.push(`category = $${values.length}`);
  }

  if (params.search) {
    values.push(`%${params.search.trim()}%`);
    conditions.push(`
      (
        title ILIKE $${values.length}
        OR subtitle ILIKE $${values.length}
        OR description ILIKE $${values.length}
      )
    `);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM ${DB_PROJECTS} ${where}`,
    values,
  );

  return result.rows[0].total;
};

export const createProject = async (body: ProjectCreate) => {
  const data = projectColumnCreateSchema.parse(body);

  const columns = Object.keys(data);
  const values = Object.values(data);

  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO ${DB_PROJECTS} (${columns.join(", ")})
    VALUES (${placeholders})
    RETURNING ${DB_PROJECT}
  `;

  const result = await pool.query<Project>(query, values);

  return result.rows[0];
};

export const updateProject = async (id: Id, body: ProjectUpdate) => {
  const data = projectColumnUpdateSchema.parse(body);

  const entries = Object.entries(data);
  const values = entries.map(([, value]) => value);
  const fields = entries.map(([column], i) => `${column} = $${i + 1}`);

  fields.push("updated_at = NOW()");
  values.push(id);

  const query = `
    UPDATE ${DB_PROJECTS}
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING ${DB_PROJECT}
  `;

  const result = await pool.query<Project>(query, values);

  return result.rows[0];
};

export const deleteProject = async (id: Id) => {
  const values = [id];

  const query = `DELETE FROM ${DB_PROJECTS} WHERE id = $${values.length}`;
  const result = await pool.query(query, values);

  return !!result.rowCount && result.rowCount > 0;
};
