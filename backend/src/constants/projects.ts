export const DB_PROJECTS = "projects";

export const DB_PROJECT = `
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
