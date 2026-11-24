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
  priority: z.number().int().min(0),
  sortOrder: z.number().int().min(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

/** Lists */

export const projectListRequestSchema = z.object({
  params: listRequestParamsSchema.extend({
    search: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    category: projectCategoryEnum
      .nullable()
      .optional()
      .transform((v) => v || undefined),
  }),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);
