import { z } from "zod";

export const listRequestParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export function listResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
    results: z.array(itemSchema),
  });
}
