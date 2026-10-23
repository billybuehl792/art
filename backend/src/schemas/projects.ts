import { z } from "zod";
import { listRequestParamsSchema, listResponseSchema } from "./pagination";
import { idSchema } from "./basic";

const projectCategoryEnum = z.enum(["art", "dev"]);

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

export const projectUpdateSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),

    category: projectCategoryEnum.optional(),
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

export const projectListRequestParamsSchema = listRequestParamsSchema.extend({
  category: projectCategoryEnum.nullable().optional(),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);
