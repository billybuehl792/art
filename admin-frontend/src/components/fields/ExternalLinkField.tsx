import {
  InputAdornment,
  TextField,
  IconButton,
  type TextFieldProps,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Link as LinkIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";

interface ExternalLinkFieldProps extends Omit<
  TextFieldProps,
  "type" | "value"
> {
  type?: "url";
  value: string;
}

const ExternalLinkField: React.FC<ExternalLinkFieldProps> = ({
  value,
  disabled,
  onChange,
  ...props
}) => {
  /** Callbacks */

  const handleOpenLink = () => {
    if (value) window.open(value, "_blank", "noopener,noreferrer");
  };

  const handleOnClear = () =>
    onChange?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);

  return (
    <TextField
      label="External Link"
      placeholder="https://example.com"
      type="url"
      fullWidth
      value={value}
      disabled={disabled}
      onChange={onChange}
      {...props}
      slotProps={{
        ...props?.slotProps,
        input: {
          ...props?.slotProps?.input,
          startAdornment: (
            <InputAdornment position="start">
              <LinkIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                disabled={!value || disabled}
                onClick={handleOpenLink}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
              {!!value && (
                <IconButton size="small" onClick={handleOnClear}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default ExternalLinkField;
