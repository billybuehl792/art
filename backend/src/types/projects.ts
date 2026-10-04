import type { Request } from "express";
import { z } from "zod";
import {
  projectListResponseSchema,
  projectSchema,
  projectListRequestParamsSchema,
  projectCreateBodySchema,
} from "../schemas/projects";

export type Project = z.infer<typeof projectSchema>;

// Create

export type ProjectCreateBody = z.infer<typeof projectCreateBodySchema>;

export type ProjectCreateRequest = Request<{}, ProjectCreateBody, {}>;

// List

export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;

export type ProjectListRequest = Request<{}, {}, {}, ProjectListRequestParams>;

export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
