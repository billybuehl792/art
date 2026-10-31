import React from "react";
import { Skeleton, type SkeletonProps } from "@mui/material";
import { sxArray } from "@/utils";

const ProjectListItemSkeleton: React.FC<SkeletonProps> = (props) => {
  return (
    <Skeleton
      variant="rounded"
      {...props}
      sx={sxArray({ height: 150 }, props?.sx)}
    />
  );
};

export default ProjectListItemSkeleton;
