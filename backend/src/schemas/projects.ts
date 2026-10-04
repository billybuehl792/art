import { z } from "zod";
import { listRequestParamsSchema, listResponseSchema } from "./pagination";

export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
});

export const projectCreateBodySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string(),
  sortOrder: z.number().int().default(0),
});

export const projectListRequestParamsSchema = listRequestParamsSchema.extend({
  type: z.string().optional(),
});

export const projectListResponseSchema = listResponseSchema(projectSchema);

export const mediaSchema = z.object({
  id: z.number(),
  projectId: z.number(),
  title: z.string().optional(),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  mediaType: z.string(),
  sortOrder: z.number(),
  createdAt: z.coerce.date(),
});
