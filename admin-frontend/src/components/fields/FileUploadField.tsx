import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography, type StackProps } from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface FileUploadFieldProps extends Omit<StackProps, "onChange"> {
  label: string;
  value: File | null;
  disabled?: boolean;
  accept?: string;
  onChange: (file: File | null) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  value,
  disabled,
  accept = "image/*",
  onChange,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);
  const [src, setSrc] = useState("");

  /** Callbacks */

  const handleFile = (file?: File) => {
    if (!file) return;
    onChange(file);

    // Allow selecting the same file again.
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);

    if (disabled) return;

    handleFile(event.dataTransfer.files[0]);
  };

  /** Effects */

  useEffect(() => {
    const handleSetSrc = (value: string) => setSrc(value);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") handleSetSrc(reader.result);
    };

    if (value) reader.readAsDataURL(value);
    else handleSetSrc("");

    return () => reader.abort();
  }, [value]);

  return (
    <Stack {...props}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        disabled={disabled}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <Box
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          minHeight: 120,
          p: 2,
          border: 1,
          borderStyle: "dashed",
          borderColor: dragging ? "primary.main" : "divider",
          borderRadius: 2,
          bgcolor: dragging ? "action.hover" : "background.default",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color 150ms, background-color 150ms",
          overflow: "hidden",
          "&:hover": { borderColor: disabled ? "divider" : "primary.main" },
        }}
      >
        {src ? (
          <>
            <Box
              component="img"
              src={src}
              alt={`${label} preview`}
              sx={{
                maxWidth: "100%",
                maxHeight: 150,
                objectFit: "contain",
                borderRadius: 1,
              }}
            />

            <Typography variant="body2" color="text.secondary">
              {value?.name}
            </Typography>
          </>
        ) : (
          <>
            <UploadIcon sx={{ fontSize: 40, color: "text.secondary" }} />
            <Typography variant="body1">
              {dragging ? "Drop image here" : label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag and drop an image here, or click to browse
            </Typography>
          </>
        )}
      </Box>

      {value && (
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {`${(value.size / 1024 / 1024).toFixed(2)} MB`}
          </Typography>

          <Button
            size="small"
            color="error"
            disabled={disabled}
            startIcon={<CloseIcon />}
            onClick={() => onChange(null)}
          >
            Remove
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default FileUploadField;
