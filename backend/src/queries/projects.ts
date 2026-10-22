import { pool } from "../db";
import type {
  Id,
  Project,
  ProjectListRequestParams,
  ProjectCreate,
  ProjectUpdate,
} from "../types/projects";

const PROJECT = `
id,
title,
subtitle,
description,
category,
link,
media_type AS "mediaType",
media_url AS "mediaUrl",
thumbnail_url AS "thumbnailUrl",
priority,
sort_order AS "sortOrder",
created_at AS "createdAt",
updated_at AS "updatedAt"
`;
const SELECT_PROJECT = `SELECT ${PROJECT} FROM PROJECTS`;

export const getProject = async (id: Id) => {
  const result = await pool.query<Project>(
    `${SELECT_PROJECT} WHERE id = $1 LIMIT 1`,
    [id],
  );

  return result.rows[0];
};

export const getProjects = async (params: ProjectListRequestParams) => {
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (params.category) {
    values.push(params.category);
    conditions.push(`category = $${values.length}`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderBy = "ORDER BY sort_order ASC, created_at DESC";
  const limit = `LIMIT $${values.length + 1}`;
  const offset = `OFFSET $${values.length + 2}`;

  values.push(params.limit);
  values.push((params.page - 1) * params.limit);

  const result = await pool.query<Project>(
    `${SELECT_PROJECT} ${where} ${orderBy} ${limit} ${offset}`,
    values,
  );

  return result.rows;
};

export const getProjectsCount = async (params: ProjectListRequestParams) => {
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (params.category) {
    values.push(params.category);
    conditions.push(`category = $${values.length}`);
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

export const createProject = async (body: ProjectCreate) => {
  const result = await pool.query<Project>(
    `
      INSERT INTO projects (
        title,
        subtitle,
        description,
        category,
        link,
        media_type,
        media_url,
        thumbnail_url,
        priority,
        sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING ${PROJECT}
    `,
    [
      body.title,
      body.subtitle,
      body.description,
      body.category,
      body.link,
      body.mediaType,
      body.mediaUrl,
      body.thumbnailUrl,
      body.priority,
      body.sortOrder,
    ],
  );

  return result.rows[0];
};

export const updateProject = async (id: Id, body: ProjectUpdate) => {
  const fields: string[] = [];
  const values: unknown[] = [];

  const addField = (column: string, value: unknown) => {
    fields.push(`${column} = $${values.length + 1}`);
    values.push(value);
  };

  if (body.title !== undefined) addField("title", body.title);
  if (body.subtitle !== undefined) addField("subtitle", body.subtitle);
  if (body.description !== undefined) addField("description", body.description);
  if (body.link !== undefined) addField("link", body.link);
  if (body.mediaType !== undefined) addField("media_type", body.mediaType);
  if (body.mediaUrl !== undefined) addField("media_url", body.mediaUrl);
  if (body.thumbnailUrl !== undefined)
    addField("thumbnail_url", body.thumbnailUrl);
  if (body.priority !== undefined) addField("priority", body.priority);
  if (body.sortOrder !== undefined) addField("sort_order", body.sortOrder);

  if (fields.length === 0) throw new Error("No fields to update");

  values.push(id);

  const where = `WHERE id = $${values.length}`;

  const result = await pool.query<Project>(
    `UPDATE projects SET ${fields.join(", ")} ${where} RETURNING ${PROJECT}`,
    values,
  );

  return result.rows[0];
};

export const deleteProject = async (id: Id) => {
  const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
  return !!result.rowCount && result.rowCount > 0;
};
