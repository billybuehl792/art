import { z } from "zod";
import {
  idSchema,
  listRequestParamsSchema,
  listResponseSchema,
  projectSchema,
  projectCreateSchema,
  projectUpdateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  uploadResponseSchema,
} from "./schemas";

export type Id = z.infer<typeof idSchema>;

/** Requests */

export type ListRequestParams = z.infer<typeof listRequestParamsSchema>;
export type ListResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof listResponseSchema<T>>
>;

/** Projects */
export type Project = z.infer<typeof projectSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;

/** Uploads */

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
