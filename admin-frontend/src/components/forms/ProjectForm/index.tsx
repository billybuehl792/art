import React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  type BoxProps,
} from "@mui/material";
import { projectCategoryEnum } from "@/schemas";

const projectFormSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string(),
  description: z.string(),
  category: projectCategoryEnum.nullable(),
  link: z.string().nullable(),
  priority: z.number().nonnegative(),
  sortOrder: z.number().nonnegative(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const DEFAULT_VALUES: ProjectFormValues = {
  title: "",
  subtitle: "",
  description: "",
  category: null,
  link: null,
  priority: 1,
  sortOrder: 0,
};

export interface ProjectFormProps extends Omit<
  BoxProps<"form">,
  "component" | "onSubmit"
> {
  defaultValues?: ProjectFormValues;
  error?: Error | null;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  defaultValues,
  error,
  onSubmit,
  ...props
}) => {
  /** Values */

  const form = useForm({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    } satisfies ProjectFormValues,
    validators: { onSubmit: projectFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      {...props}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Stack spacing={2}>
        <form.Field name="title">
          {(field) => (
            <TextField
              label="Title"
              size="small"
              value={field.state.value}
              error={field.state.meta.isTouched && !field.state.meta.isValid}
              helperText={field.state.meta.errors[0]?.message}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
        <form.Field name="subtitle">
          {(field) => (
            <TextField
              label="Subtitle"
              size="small"
              value={field.state.value}
              error={field.state.meta.isTouched && !field.state.meta.isValid}
              helperText={field.state.meta.errors[0]?.message}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <Divider />

        <form.Field name="priority">
          {(field) => (
            <TextField
              label="Priority"
              size="small"
              type="number"
              value={field.state.value}
              error={field.state.meta.isTouched && !field.state.meta.isValid}
              helperText={field.state.meta.errors[0]?.message}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        {!!error && <Alert severity="error">{error.message}</Alert>}

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
                Submit
              </Button>
            </Stack>
          )}
        </form.Subscribe>
      </Stack>
    </Box>
  );
};

export default ProjectForm;
