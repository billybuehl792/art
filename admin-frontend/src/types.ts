import type { z } from "zod";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  uploadResponseSchema,
  type idSchema,
  type listRequestParamsSchema,
  type listResponseSchema,
  type loginSchema,
  type projectCreateSchema,
  type projectListRequestParamsSchema,
  type projectListResponseSchema,
  type projectSchema,
  type projectUpdateSchema,
} from "./schemas";

/** Basic */

export type Id = z.infer<typeof idSchema>;

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

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
