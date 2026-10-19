import { z } from "zod";
import { listRequestParamsSchema, listResponseSchema } from "./pagination";

export const idSchema = z.coerce.number().int().positive();

const projectCategoryEnum = z.enum(["", "art", "dev"]);

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

export const projectCreateSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().default(""),
  description: z.string().optional().default(""),
  category: projectCategoryEnum.optional().default(""),
  link: z.string().nullable().optional().default(null),
  mediaType: z.string().nullable().optional().default(null),
  mediaUrl: z.string().nullable().optional().default(null),
  thumbnailUrl: z.string().nullable().optional().default(null),
  sortOrder: z.coerce.number().int().default(0),
});

export const projectUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    category: projectCategoryEnum.optional(),
    link: z.string().nullable().optional(),
    mediaType: z.string().nullable().optional(),
    mediaUrl: z.string().nullable().optional(),
    thumbnailUrl: z.string().nullable().optional(),
    sortOrder: z.coerce.number().int().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const projectListRequestParamsSchema = listRequestParamsSchema.extend({
  category: projectCategoryEnum.optional(),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);
