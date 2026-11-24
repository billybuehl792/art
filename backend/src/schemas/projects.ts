import { z } from "zod";
import { idSchema, listRequestParamsSchema, listResponseSchema } from "./basic";

export const projectCategoryEnum = z.enum(["art", "dev"]);

export const projectSchema = z.object({
  id: idSchema,
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  category: projectCategoryEnum,
  link: z.url().nullable(),
  mediaType: z.string().nullable(),
  mediaUrl: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  priority: z.coerce.number().int().min(0),
  sortOrder: z.coerce.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/** Lists */

export const projectListRequestParamsSchema = listRequestParamsSchema.extend({
  search: z.string().trim().optional(),
  category: projectCategoryEnum.nullable().optional(),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);
