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

export const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`Failed to download file: ${response.status}`);

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(blobUrl);
};
