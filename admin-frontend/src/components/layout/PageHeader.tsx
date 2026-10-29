import React, { type ReactNode } from "react";
import {
  Stack,
  styled,
  Typography,
  type StackProps,
  type TypographyProps,
} from "@mui/material";
import { sxArray, truncateText } from "@/utils/sx";

interface PageHeaderProps extends Omit<StackProps, "title"> {
  title: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  slotProps?: { title?: TypographyProps };
}

const StyledStack = styled(Stack)(({ theme }) => ({
  position: "sticky",
  top: theme.layout.appBarHeight,
  display: "flex",
  alignItems: "center",
  height: theme.layout.pageHeaderHeight,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar - 1,
}));

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  startContent,
  endContent,
  slotProps,
  ...props
}) => {
  return (
    <StyledStack direction="row" spacing={1} {...props}>
      {startContent}
      {typeof title === "string" || typeof title === "number" ? (
        <Typography
          variant="h2"
          {...slotProps?.title}
          sx={sxArray({ flexGrow: 1 }, truncateText, slotProps?.title?.sx)}
        >
          {title}
        </Typography>
      ) : (
        title
      )}
      {endContent}
    </StyledStack>
  );
};

export default PageHeader;
