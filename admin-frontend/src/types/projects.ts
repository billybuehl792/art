import type { z } from "zod";
import type {
  projectSchema,
  projectCreateSchema,
  projectUpdateSchema,
  projectListRequestSchema,
  projectListResponseSchema,
  projectListReorderSchema,
} from "@/schemas/projects";

export type Project = z.infer<typeof projectSchema>;

export type ProjectCreate = z.infer<typeof projectCreateSchema>;

export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;

export type ProjectListRequest = z.infer<typeof projectListRequestSchema>;

export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;

export type ProjectListReorder = z.infer<typeof projectListReorderSchema>;
