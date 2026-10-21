import { z } from "zod";

export const uploadResponseSchema = z.object({
  mediaType: z.string(),
  mediaUrl: z.string(),
  thumbnailUrl: z.string(),
});
