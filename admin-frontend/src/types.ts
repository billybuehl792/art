import type { z } from "zod";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
  uploadCreateSchema,
  uploadResponseSchema,
  idSchema,
  listRequestParamsSchema,
  listResponseSchema,
  loginSchema,
  projectCreateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectSchema,
  projectUpdateSchema,
} from "./schemas";

/** Basic */

type MenuItemColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "info"
  | "success";

export interface MenuOption {
  id: string;
  render?: boolean;
  title: string;
  subtitle?: string;
  color?: MenuItemColor;
  Icon: SvgIconComponent;
  onClick: VoidFunction;
}

export type Id = z.infer<typeof idSchema>;

/** Lists */

export type ListRequestParams = z.infer<typeof listRequestParamsSchema>;

export type ListResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof listResponseSchema<T>>
>;

/** Auth */

export type Login = z.infer<typeof loginSchema>;

/** Projects */

export type Project = z.infer<typeof projectSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectListRequestParams = z.infer<
  typeof projectListRequestParamsSchema
>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;

/** Uploads */

export type UploadCreate = z.infer<typeof uploadCreateSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
