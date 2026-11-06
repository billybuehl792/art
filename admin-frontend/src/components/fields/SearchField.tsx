import React, { useEffect, useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { Clear as ClearIcon, Search as SearchIcon } from "@mui/icons-material";

export interface SearchFieldProps extends Omit<
  TextFieldProps,
  "value" | "onChange"
> {
  value: string;
  delay?: number;
  onChange: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  value,
  delay = 300,
  onChange,
  ...props
}) => {
  /** Values */

  const [search, setSearch] = useState(value);

  /** Effects */

  useEffect(() => {
    if (search === value) return;

    const timeout = setTimeout(() => {
      onChange(search);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, search, delay, onChange]);

  useEffect(() => {
    const handleSearchChange = (v: string) => setSearch(v);
    handleSearchChange(value);
  }, [value]);

  return (
    <TextField
      value={search}
      size="small"
      placeholder="Search"
      onChange={(e) => setSearch(e.target.value)}
      {...props}
      slotProps={{
        ...props?.slotProps,
        input: {
          ...props?.slotProps?.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                aria-label="Clear search"
                edge="end"
                onClick={() => setSearch("")}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchField;
