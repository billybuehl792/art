import { z } from "zod";
import {
  projectListResponseSchema,
  projectSchema,
  projectListRequestParamsSchema,
  projectCreateSchema,
  projectUpdateSchema,
} from "../schemas/projects";

export type Project = z.infer<typeof projectSchema>;

export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
