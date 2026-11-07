import type { z } from "zod";
import type { SvgIconComponent } from "@mui/icons-material";
import type {
  idSchema,
  listRequestParamsSchema,
  listResponseSchema,
} from "@/schemas/basic";

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

export type ListRequestParams = z.infer<typeof listRequestParamsSchema>;

export type ListResponse<T extends z.ZodType> = z.infer<
  ReturnType<typeof listResponseSchema<T>>
>;
