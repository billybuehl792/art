import type { z } from "zod";
import type { idSchema } from "@/schemas/basic";

export type Id = z.infer<typeof idSchema>;
