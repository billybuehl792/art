import { pool } from "../db";
import { DB_PROJECT, DB_PROJECTS } from "../constants/projects";
import {
  projectColumnCreateSchema,
  projectColumnUpdateSchema,
} from "../schemas/projects";
import type { Id } from "../types/basic";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListRequestParams,
  ProjectListReorder,
} from "../types/projects";
import { HttpError } from "../utils/errors";

export const getProject = async (id: Id) => {
  const query = `SELECT ${DB_PROJECT} FROM ${DB_PROJECTS} WHERE id = $1 LIMIT 1`;
  const result = await pool.query<Project>(query, [id]);

  const project = result.rows[0];
  if (!project) throw new HttpError(404, "Project not found");

  return project;
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

  if (!result.rowCount) throw new HttpError(404, "Project not found");
};

export const reorderProject = async (body: ProjectListReorder) => {
  const { targetId, afterId } = body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`LOCK TABLE ${DB_PROJECTS} IN SHARE ROW EXCLUSIVE MODE`);

    const { rows } = await client.query(
      `SELECT id FROM ${DB_PROJECTS} ORDER BY sort_order ASC, id ASC`,
    );

    const ids = rows.map((row) => row.id);

    const isAfterProject = afterId !== null && afterId !== undefined;
    const targetIndex = ids.indexOf(targetId);
    const afterIndex = isAfterProject ? ids.indexOf(afterId) : -1;

    if (targetIndex === -1)
      throw new HttpError(404, "Target project not found");
    if (isAfterProject && afterIndex === -1)
      throw new HttpError(404, "After project not found");

    ids.splice(targetIndex, 1);
    const newIndex = isAfterProject ? ids.indexOf(afterId) + 1 : 0;
    ids.splice(newIndex, 0, targetId);

    const query = `
        UPDATE projects AS p
        SET sort_order = ordered.position
        FROM unnest($1::int[]) WITH ORDINALITY
          AS ordered(id, position)
        WHERE p.id = ordered.id
      `;
    const values = [ids];

    await client.query(query, values);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
