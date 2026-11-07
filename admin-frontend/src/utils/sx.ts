import type { SxProps, Theme } from "@mui/material/styles";

export const truncateText: SxProps<Theme> = () => {
  return {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  };
};

export const sxArray = (
  ...sx: Array<SxProps<Theme> | undefined>
): SxProps<Theme> => {
  return sx.flatMap((value) => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  });
};
