import React, { type ReactNode } from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  type CardProps,
} from "@mui/material";
import {
  InboxOutlined as InboxOutlinedIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

type Status = "loading" | "empty" | "error";

export interface StatusCardProps extends CardProps {
  status: Status;
  title?: string;
  message?: string;
  action?: ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  message,
  action,
  ...props
}) => {
  /** Values */

  const content = {
    loading: {
      icon: <CircularProgress />,
      title: title ?? "Loading...",
      message,
    },
    empty: {
      icon: <InboxOutlinedIcon fontSize="large" />,
      title: title ?? "Nothing here",
      message,
    },
    error: {
      icon: <ErrorIcon fontSize="large" />,
      title: title ?? "Something went wrong",
      message,
    },
  }[status];

  return (
    <Card {...props}>
      <CardContent>
        <Stack
          spacing={1}
          sx={{
            py: 6,
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content.icon}
          <Typography variant="h3">{content.title}</Typography>
          {content.message && (
            <Typography variant="subtitle2" color="text.secondary">
              {content.message}
            </Typography>
          )}
          {action}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
