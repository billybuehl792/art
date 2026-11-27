import React from "react";
import { useColorScheme } from "@mui/material/styles";
import {
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  type StackProps,
  type SwitchProps,
} from "@mui/material";
import ColorModeSwitch from "../buttons/ColorModeSwitch";
import { truncateText } from "@/utils/sx";

const SettingsForm: React.FC<StackProps> = (props) => {
  /** Values */

  const colorMode = useColorScheme();

  /** Callbacks */

  const handleThemeOnChange: SwitchProps["onChange"] = (_, checked) =>
    colorMode.setMode(checked ? "dark" : "light");

  return (
    <Stack spacing={2} divider={<Divider />} {...props}>
      <Typography variant="h3" sx={truncateText}>
        App Settings
      </Typography>
      <Stack>
        <FormGroup>
          <FormControlLabel
            label="Theme"
            control={
              <ColorModeSwitch
                checked={colorMode.mode === "dark"}
                onChange={handleThemeOnChange}
              />
            }
            sx={{ alignSelf: "flex-start" }}
          />
        </FormGroup>
      </Stack>
    </Stack>
  );
};

export default SettingsForm;
