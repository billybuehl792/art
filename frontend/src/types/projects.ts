import type { z } from "zod";
import type {
  projectSchema,
  projectListRequestSchema,
  projectListResponseSchema,
} from "@/schemas/projects";

export type Project = z.infer<typeof projectSchema>;

export type ProjectListRequest = z.infer<typeof projectListRequestSchema>;

export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
