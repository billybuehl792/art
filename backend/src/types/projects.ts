import { z } from "zod";
import { idSchema } from "../schemas/basic";
import {
  projectListResponseSchema,
  projectSchema,
  projectListRequestParamsSchema,
  projectCreateSchema,
  projectUpdateSchema,
} from "../schemas/projects";

export type Id = z.infer<typeof idSchema>;

export type Project = z.infer<typeof projectSchema>;

// CRUD
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

// Params
export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
