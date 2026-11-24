import { z } from "zod";
import {
  projectSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
} from "../schemas/projects";

export type Project = z.infer<typeof projectSchema>;

/** Lists */

export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;

export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
