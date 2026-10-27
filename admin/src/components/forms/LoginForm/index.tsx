import React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  type BoxProps,
} from "@mui/material";

const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export interface LoginFormProps extends Omit<
  BoxProps<"form">,
  "component" | "onSubmit"
> {
  defaultValues?: LoginFormValues;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  error: Error | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ error, onSubmit, ...props }) => {
  /** Values */

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: loginFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });
  const isError = !!error;

  return (
    <Box
      component="form"
      noValidate
      {...props}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Stack spacing={2}>
        <form.Field name="email">
          {(field) => {
            const error =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <FormControl error={!!error} fullWidth>
                <TextField
                  label="Email"
                  type="email"
                  size="small"
                  autoComplete="username"
                  value={field.state.value}
                  error={!!error}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {error && (
                  <FormHelperText>
                    {field.state.meta.errors[0]?.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const error =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <FormControl error={!!error} fullWidth>
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="password"
                  size="small"
                  value={field.state.value}
                  error={!!error}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {error && (
                  <FormHelperText>
                    {field.state.meta.errors[0]?.message}
                  </FormHelperText>
                )}
              </FormControl>
            );
          }}
        </form.Field>

        {isError && <Alert severity="error">{error.message}</Alert>}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!canSubmit}
                sx={{ px: 4 }}
              >
                Sign in
              </Button>
            </Stack>
          )}
        </form.Subscribe>
      </Stack>
    </Box>
  );
};

export default LoginForm;
