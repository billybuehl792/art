import { z } from "zod";
import {
  projectSchema,
  projectCreateSchema,
  projectUpdateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectListReorderSchema,
} from "../schemas/projects";

export type Project = z.infer<typeof projectSchema>;

export type ProjectCreate = z.infer<typeof projectCreateSchema>;

export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

/** Lists */

export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;

export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;

export type ProjectListReorder = z.infer<typeof projectListReorderSchema>;
