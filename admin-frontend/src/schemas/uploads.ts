import { z } from "zod";

export const uploadCreateSchema = z.object({
  file: z.custom<File>((value) => value instanceof File),
});

export const uploadResponseSchema = z.object({
  mediaType: z.string(),
  mediaUrl: z.string(),
  thumbnailUrl: z.string(),
});
