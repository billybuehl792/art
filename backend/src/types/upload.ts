import { z } from "zod";
import { uploadResponseSchema } from "../schemas/upload";

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
