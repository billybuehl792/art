import { z } from "zod";
import {
  projectListResponseSchema,
  projectSchema,
  projectListRequestParamsSchema,
  projectCreateBodySchema,
  projectUpdateBodySchema,
  idSchema,
} from "../schemas/projects";

export type Id = z.infer<typeof idSchema>;

export type Project = z.infer<typeof projectSchema>;

// CRUD
export type ProjectCreateBody = z.infer<typeof projectCreateBodySchema>;
export type ProjectUpdateBody = z.infer<typeof projectUpdateBodySchema>;

// Params
export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
