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
  bottomContent?: ReactNode;
  slotProps?: { title?: TypographyProps };
}

const StyledStack = styled(Stack)(({ theme }) => ({
  position: "sticky",
  top: theme.layout.appBarHeight,
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar - 1,
}));

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  startContent,
  endContent,
  bottomContent,
  slotProps,
  ...props
}) => {
  return (
    <StyledStack spacing={1.5} {...props} sx={sxArray({ py: 2 }, props?.sx)}>
      <Stack
        direction="row"
        spacing={1}
        sx={sxArray({ flexGrow: 1, alignItems: "center" })}
      >
        <Stack sx={{ flexGrow: 1 }}>
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
        </Stack>
        {endContent}
      </Stack>
      {bottomContent}
    </StyledStack>
  );
};

export default PageHeader;
