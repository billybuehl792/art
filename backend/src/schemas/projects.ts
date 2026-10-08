import { z } from "zod";
import { listRequestParamsSchema, listResponseSchema } from "./pagination";

export const idSchema = z.coerce.number().int().positive();

const projectCategoryEnum = z.enum(["art", "dev"]);

export const projectSchema = z.object({
  id: idSchema,
  title: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  category: projectCategoryEnum.nullable(),
  link: z.string().nullable(),
  mediaType: z.string().nullable(),
  mediaUrl: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
});

export const projectCreateBodySchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: projectCategoryEnum.nullable().optional(),
  link: z.string().nullable().optional(),
  mediaType: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export const projectUpdateBodySchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: projectCategoryEnum.nullable().optional(),
  link: z.string().nullable().optional(),
  mediaType: z.string().nullable().optional(),
  mediaUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  sortOrder: z.number().int().optional(),
});

export const projectListRequestParamsSchema = listRequestParamsSchema.extend({
  category: projectCategoryEnum.optional(),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);
