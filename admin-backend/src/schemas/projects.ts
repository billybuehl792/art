import { z } from "zod";
import { idSchema, listRequestParamsSchema, listResponseSchema } from "./basic";

export const projectCategoryEnum = z.enum(["art", "dev"]);

export const projectSchema = z.object({
  id: idSchema,
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  category: projectCategoryEnum.nullable(),
  link: z.string().nullable(),
  mediaType: z.string().nullable(),
  mediaUrl: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  priority: z.coerce.number(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const projectCreateSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  category: projectCategoryEnum.nullable().optional(),
  link: z.string().nullable().optional(),
  mediaType: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  priority: z.coerce.number().int().positive().optional().default(1),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

export const projectColumnCreateSchema = projectCreateSchema.transform(
  (data) => ({
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    category: data.category,
    link: data.link,
    media_type: data.mediaType,
    media_url: data.mediaUrl,
    thumbnail_url: data.thumbnailUrl,
    priority: data.priority,
    sort_order: data.sortOrder,
  }),
);

export const projectUpdateSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    category: projectCategoryEnum.nullable().optional(),
    link: z.string().nullable().optional(),
    mediaType: z.string().nullable().optional(),
    mediaUrl: z.string().nullable().optional(),
    thumbnailUrl: z.string().nullable().optional(),
    priority: z.coerce.number().int().positive().optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const projectColumnUpdateSchema = projectUpdateSchema.transform(
  (data) => ({
    ...(data.title !== undefined && { title: data.title }),
    ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.category !== undefined && { category: data.category }),
    ...(data.link !== undefined && { link: data.link }),
    ...(data.mediaType !== undefined && { media_type: data.mediaType }),
    ...(data.mediaUrl !== undefined && { media_url: data.mediaUrl }),
    ...(data.thumbnailUrl !== undefined && {
      thumbnail_url: data.thumbnailUrl,
    }),
    ...(data.priority !== undefined && { priority: data.priority }),
    ...(data.sortOrder !== undefined && { sort_order: data.sortOrder }),
  }),
);

export const projectListRequestParamsSchema = listRequestParamsSchema.extend({
  search: z.string().trim().optional(),
  category: projectCategoryEnum.nullable().optional(),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);
