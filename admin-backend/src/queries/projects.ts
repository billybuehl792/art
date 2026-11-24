import pool from "../db";
import {
  projectColumnCreateSchema,
  projectColumnUpdateSchema,
} from "../schemas/projects";
import { DB_PROJECT, DB_PROJECTS } from "../constants/projects";
import {
  buildInsertQuery,
  buildSelectQuery,
  buildUpdateQuery,
  buildWhereQueryClause,
} from "../utils/queries";
import { HttpError } from "../utils/errors";
import type { Id } from "../types/basic";
import type {
  Project,
  ProjectCreate,
  ProjectUpdate,
  ProjectListRequestParams,
  ProjectListReorder,
} from "../types/projects";

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

export const reorderProject = async ({
  targetId,
  afterId,
  category,
}: ProjectListReorder) => {
  if (targetId === afterId)
    throw new HttpError(400, "Cannot position project after itself");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`LOCK TABLE ${DB_PROJECTS} IN SHARE ROW EXCLUSIVE MODE`);

    const projectListQuery = await client.query<Project>(
      `SELECT ${DB_PROJECT}
      FROM ${DB_PROJECTS}
      WHERE category = $1
      ORDER BY sort_order ASC, id ASC
      FOR UPDATE`,
      [category],
    );

    let targetProject: (Project & { index: number }) | undefined;
    let afterProject: (Project & { index: number }) | undefined;
    const projectIds = projectListQuery.rows.map((project, index) => {
      if (project.id === targetId) targetProject = { ...project, index };
      else if (project.id === afterId) afterProject = { ...project, index };
      return project.id;
    });

    if (!targetProject) throw new HttpError(404, "Target project not found");
    if (afterId != null && !afterProject)
      throw new HttpError(404, "After project not found");
    if (afterProject && afterProject.category !== targetProject.category)
      throw new HttpError(404, "Cannot reorder projects of different types");

    projectIds.splice(targetProject.index, 1);
    let newIndex = 0;
    if (afterProject) {
      if (targetProject.index < afterProject.index)
        newIndex = afterProject.index;
      else newIndex = afterProject.index + 1;
    }
    projectIds.splice(newIndex, 0, targetId);

    await client.query(
      `
        UPDATE ${DB_PROJECTS} AS p
        SET sort_order = ordered.position
        FROM unnest($1::int[]) WITH ORDINALITY
          AS ordered(id, position)
        WHERE p.id = ordered.id
      `,
      [projectIds],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch((error) => {
      console.error(error);
    });
    throw error;
  } finally {
    client.release();
  }
};

export const deleteAllProjects = async () => {
  await pool.query("TRUNCATE TABLE projects RESTART IDENTITY");
};
