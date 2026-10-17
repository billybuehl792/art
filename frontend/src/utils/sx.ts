import type { SxProps } from "@mui/material";

export const truncateText: SxProps = () => ({
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
});
