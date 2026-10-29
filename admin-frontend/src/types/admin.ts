import type { z } from "zod";
import { loginSchema } from "@/schemas/admin";

export type Login = z.infer<typeof loginSchema>;
