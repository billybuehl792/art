import type { z } from "zod";
import type {
  uploadCreateSchema,
  uploadResponseSchema,
} from "@/schemas/uploads";

export type UploadCreate = z.infer<typeof uploadCreateSchema>;

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
