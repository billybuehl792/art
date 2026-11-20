import { z } from "zod";
import { uploadResponseSchema } from "../schemas/uploads";

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
