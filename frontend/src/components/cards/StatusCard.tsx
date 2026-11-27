import React, { type ReactNode } from "react";
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
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
        <Stack spacing={2} divider={<Divider />} sx={{ px: 6, py: 4 }}>
          <Stack spacing={1} sx={{ alignItems: "center" }}>
            {content.icon}
            <Typography variant="h3" sx={{ textAlign: "center" }}>
              {content.title}
            </Typography>
            {!!content.message && (
              <Typography variant="subtitle2" color="text.secondary">
                {content.message}
              </Typography>
            )}
          </Stack>
          {!!action && (
            <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
              {action}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
