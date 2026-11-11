import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();

export const listRequestParamsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .transform((v) => (v === 1 ? undefined : v)),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .transform((v) => (v === 1 ? undefined : v)),
});

export function listResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    results: z.array(itemSchema),
  });
}
