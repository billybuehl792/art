import type { z } from "zod";
import type { uploadResponseSchema } from "@/schemas/uploads";

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
