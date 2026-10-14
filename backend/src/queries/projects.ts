import { pool } from "../db";
import type {
  Id,
  Project,
  ProjectListRequestParams,
  ProjectCreate,
  ProjectUpdate,
} from "../types/projects";

export const getProject = async (id: Id) => {
  const result = await pool.query<Project>(
    `
      SELECT
        id,
        title,
        subtitle,
        description,
        category,
        link,
        media_type AS "mediaType",
        media_url AS "mediaUrl",
        thumbnail_url AS "thumbnailUrl",
        sort_order AS "sortOrder",
        created_at AS "createdAt"
      FROM projects
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0];
};

export const getProjects = async (params: ProjectListRequestParams) => {
  const { page, limit, category } = params;

  const values: unknown[] = [];
  const conditions: string[] = [];

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
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
        subtitle,
        description,
        category,
        link,
        media_type AS "mediaType",
        media_url AS "mediaUrl",
        thumbnail_url AS "thumbnailUrl",
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
        sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        title,
        subtitle,
        description,
        category,
        link,
        media_type AS "mediaType",
        media_url AS "mediaUrl",
        sort_order AS "sortOrder",
        created_at AS "createdAt"
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
  if (body.sortOrder !== undefined) addField("sort_order", body.sortOrder);

  if (fields.length === 0) throw new Error("No fields to update");

  values.push(id);

  const result = await pool.query<Project>(
    `
      UPDATE projects
      SET ${fields.join(", ")}
      WHERE id = $${values.length}
      RETURNING
        id,
        title,
        subtitle,
        description,
        link,
        media_type AS "mediaType",
        media_url AS "mediaUrl",
        thumbnail_url AS "thumbnailUrl",
        sort_order AS "sortOrder",
        created_at AS "createdAt"
    `,
    values,
  );

  return result.rows[0];
};

export const deleteProject = async (id: Id) => {
  const result = await pool.query<{ id: Id }>(
    `
      DELETE FROM projects
      WHERE id = $1
      RETURNING id
    `,
    [id],
  );

  return result.rows[0];
};
