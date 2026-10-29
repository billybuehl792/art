import { z } from "zod";
import { DEFAULT_LIMIT } from "@/constants";

export const listRequestParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(DEFAULT_LIMIT),
});

export function listResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    total: z.number().int().min(0),
    results: z.array(itemSchema),
  });
}
