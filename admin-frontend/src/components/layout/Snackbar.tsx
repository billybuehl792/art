import { forwardRef } from "react";
import { closeSnackbar, type CustomContentProps } from "notistack";
import { Alert, AlertTitle } from "@mui/material";
import { toTitleCase } from "@/utils/string";

const Snackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, message, variant }, ref) => {
    /** Values */

    const severity = variant === "default" ? "info" : variant;

    /** Callbacks */

    const handleOnClose = () => closeSnackbar(id);

    return (
      <Alert
        ref={ref}
        severity={severity}
        variant="filled"
        onClose={handleOnClose}
        sx={{ width: "100%", alignItems: "center" }}
      >
        <AlertTitle sx={{ fontWeight: "bold", mb: 0 }}>
          {toTitleCase(severity)}
        </AlertTitle>
        {message}
      </Alert>
    );
  },
);

export default Snackbar;
