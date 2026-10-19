import { z } from "zod";
import {
  listRequestParamsSchema,
  listResponseSchema,
} from "../schemas/pagination";

export type ListRequestParams = z.infer<typeof listRequestParamsSchema>;

export type ListResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof listResponseSchema<T>>
>;
