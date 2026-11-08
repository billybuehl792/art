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
  priority: z.number().nonnegative(),
  sortOrder: z.number().nonnegative(),
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

/** Lists */

export const projectListRequestSchema = z.object({
  params: listRequestParamsSchema.extend({
    search: z
      .string()
      .trim()
      .optional()
      .transform((v) => v || undefined),
    category: projectCategoryEnum.optional().transform((v) => v || undefined),
  }),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);

export const projectListReorderSchema = z
  .object({
    targetId: idSchema,
    afterId: idSchema.nullable().optional(),
  })
  .refine(({ targetId, afterId }) => targetId !== afterId, {
    message: "A project cannot be positioned after itself",
  });
