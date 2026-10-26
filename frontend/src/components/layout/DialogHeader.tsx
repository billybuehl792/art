import React, { type ReactNode } from "react";
import { styled } from "@mui/material/styles";
import {
  IconButton,
  Skeleton,
  Stack,
  Typography,
  type StackProps,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { truncateText } from "@/utils/sx";

export interface DialogHeaderProps extends Omit<StackProps, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  loading?: boolean;
  endContent?: ReactNode;
  onClose: VoidFunction;
}

const StyledStack = styled(Stack)(({ theme }) => ({
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DialogHeader: React.FC<DialogHeaderProps> = ({
  title,
  subtitle,
  loading,
  endContent,
  onClose,
  ...props
}) => {
  return (
    <StyledStack direction="row" {...props}>
      {loading ? (
        <Skeleton variant="text" sx={{ width: 200, maxWidth: "100%" }} />
      ) : (
        <Stack spacing={0.5} sx={{ flexGrow: 1, overflow: "hidden" }}>
          {typeof title === "string" || typeof title === "number" ? (
            <Typography variant="h2" sx={truncateText}>
              {title}
            </Typography>
          ) : (
            title
          )}
          {typeof subtitle === "string" || typeof subtitle === "number" ? (
            <Typography variant="subtitle2" sx={truncateText}>
              {subtitle}
            </Typography>
          ) : (
            subtitle
          )}
        </Stack>
      )}
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {endContent}
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </StyledStack>
  );
};

export default DialogHeader;
