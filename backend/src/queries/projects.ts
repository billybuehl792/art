import pool from "../db";
import { DB_PROJECT, DB_PROJECTS } from "../constants/projects";
import { buildSelectQuery, buildWhereQueryClause } from "../utils/queries";
import { HttpError } from "../utils/errors";
import type { Id } from "../types/basic";
import type { Project, ProjectListRequestParams } from "../types/projects";

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
