import React from "react";
import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  type ButtonProps,
} from "@mui/material";
import { ChevronLeft as ChevronLeftIcon } from "@mui/icons-material";

interface BackButtonProps extends Omit<ButtonProps, "children" | "onClick"> {
  label?: string | false;
}

const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  ...props
}) => {
  /** Values */

  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  const icon = <ChevronLeftIcon />;

  /** Callbacks */

  const handleBack = async () => {
    if (canGoBack) router.history.back();
    else await navigate({ to: "/" });
  };

  return (
    <Tooltip title="Back">
      <Box component="span">
        {label === false ? (
          <IconButton
            aria-label="back"
            children={icon}
            onClick={handleBack}
            {...props}
          />
        ) : (
          <Button
            aria-label="back"
            onClick={handleBack}
            startIcon={icon}
            {...props}
          >
            {label}
          </Button>
        )}
      </Box>
    </Tooltip>
  );
};

export default BackButton;
