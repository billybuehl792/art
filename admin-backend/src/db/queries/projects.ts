import pool from "../../db/pool";
import {
  projectColumnCreateSchema,
  projectColumnUpdateSchema,
} from "../../schemas/projects";
import { DB_PROJECT, DB_PROJECTS } from "../../constants/projects";
import {
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
  buildWhereQueryClause,
} from "../utils";
import { HttpError } from "../../utils/errors";
import type { Id } from "../../types/basic";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListRequestParams,
  ProjectListReorder,
} from "../../types/projects";

export const getProject = async (id: Id) => {
  const query = `SELECT ${DB_PROJECT} FROM ${DB_PROJECTS} WHERE id = $1 LIMIT 1`;
  const result = await pool.query<Project>(query, [id]);

  const project = result.rows[0];
  if (!project) throw new HttpError(404, "Project not found");

  return project;
};

export const getProjects = async (params: ProjectListRequestParams) => {
  const { query, values } = buildSelectQuery({
    table: DB_PROJECTS,
    columns: DB_PROJECT,
    where: { ...(params.category && { category: params.category }) },
    orderBy: "sort_order ASC, created_at DESC",
    limit: params.limit,
    offset: (params.page - 1) * params.limit,
    search: {
      columns: ["title", "subtitle", "description"],
      value: params?.search ?? "",
    },
  });

  const result = await pool.query<Project>(query, values);

  return result.rows;
};

export const getProjectsCount = async (params: ProjectListRequestParams) => {
  const { whereClause, values } = buildWhereQueryClause({
    where: { ...(params.category && { category: params.category }) },
    search: {
      value: params.search ?? "",
      columns: ["title", "subtitle", "description"],
    },
  });

  const result = await pool.query<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM ${DB_PROJECTS} ${whereClause}`,
    values,
  );

  return result.rows[0].total;
};

export const createProject = async (body: ProjectCreate) => {
  const data = projectColumnCreateSchema.parse(body);

  const { query, values } = buildInsertQuery({
    table: DB_PROJECTS,
    data,
    returning: DB_PROJECT,
  });

  const result = await pool.query<Project>(query, values);

  return result.rows[0];
};

export const updateProject = async (id: Id, body: ProjectUpdate) => {
  const data = projectColumnUpdateSchema.parse(body);

  const { query, values } = buildUpdateQuery({
    table: DB_PROJECTS,
    data,
    where: { id },
    returning: DB_PROJECT,
  });

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

    const targetProject = await getProject(targetId);
    const afterProject = afterId ? await getProject(afterId) : null;

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

export const deleteAllProjects = async () => {
  await pool.query("TRUNCATE TABLE projects RESTART IDENTITY");
};
