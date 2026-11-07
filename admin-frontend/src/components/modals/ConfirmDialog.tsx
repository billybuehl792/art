import { type ReactNode } from "react";
import {
  Button,
  type ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  type DialogProps,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { truncateText } from "@/utils/sx";

export interface ConfirmOptions {
  title?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  confirmButton?: ButtonProps;
  cancelButton?: ButtonProps;
}

interface IConfirmDialogProps
  extends Omit<DialogProps, "title" | "content" | "onClose">, ConfirmOptions {
  onConfirm: VoidFunction;
  onClose: VoidFunction;
}

const ConfirmDialog: React.FC<IConfirmDialogProps> = ({
  title = "Confirm",
  description = "Are you sure you want to continue?",
  content,
  confirmButton,
  cancelButton,
  onConfirm,
  onClose,
  ...props
}) => {
  return (
    <Dialog maxWidth="xs" onClose={onClose} {...props}>
      <Stack
        direction="row"
        sx={(theme) => ({
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: 2,
          py: 1,
        })}
      >
        <Typography variant="h2" sx={truncateText}>
          {title}
        </Typography>
        <IconButton color="primary" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <DialogContentText sx={{ texAlign: "center" }}>
          {description}
        </DialogContentText>
        {typeof content === "string" || typeof content === "number" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="error"
          children="Cancel"
          onClick={onClose}
          {...cancelButton}
        />
        <Button
          autoFocus
          children="Confirm"
          onClick={onConfirm}
          {...confirmButton}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
