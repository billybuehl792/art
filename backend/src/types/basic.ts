import { z } from "zod";
import {
  idSchema,
  listRequestParamsSchema,
  listResponseSchema,
  filenameSchema,
} from "../schemas/basic";

export type Id = z.infer<typeof idSchema>;

export type Filename = z.infer<typeof filenameSchema>;

/** Lists */

export type ListRequestParams = z.infer<typeof listRequestParamsSchema>;

export type ListResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof listResponseSchema<T>>
>;
