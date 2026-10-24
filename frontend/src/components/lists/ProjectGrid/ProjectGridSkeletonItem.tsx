import React from "react";
import {
  CircularProgress,
  ImageListItem,
  Skeleton,
  type ImageListItemProps,
  type SkeletonProps,
} from "@mui/material";
import { sxArray } from "@/utils/sx";

interface ProjectGridSkeletonItemProps extends Omit<
  ImageListItemProps,
  "children"
> {
  spinner?: boolean;
  slotProps?: { skeleton?: SkeletonProps };
}

const ProjectGridSkeletonItem: React.FC<ProjectGridSkeletonItemProps> = ({
  spinner,
  slotProps,
  ...props
}) => {
  return (
    <ImageListItem {...props} sx={sxArray({ aspectRatio: "1 / 1" }, props?.sx)}>
      {!!spinner && (
        <CircularProgress
          aria-label="Loading…"
          sx={{ position: "absolute", inset: 0, placeSelf: "center" }}
        />
      )}
      <Skeleton
        variant="rectangular"
        animation="wave"
        {...slotProps?.skeleton}
        sx={sxArray({ width: "100%", height: "100%" }, slotProps?.skeleton?.sx)}
      />
    </ImageListItem>
  );
};

export default ProjectGridSkeletonItem;
