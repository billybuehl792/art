import React from "react";
import { useBlocker } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  type BoxProps,
} from "@mui/material";
import FileUploadField from "@/components/fields/FileUploadField";
import { useConfirm } from "@/providers/ConfirmProvider";
import { projectCategoryEnum } from "@/schemas/projects";

const projectFormSchema = z.object({
  title: z.string().trim().min(1),
  subtitle: z.string(),
  description: z.string(),
  category: projectCategoryEnum.nullable(),
  link: z.string().nullable(),
  media: z.custom<File>((value) => value instanceof File).nullable(),
  priority: z.number().nonnegative(),
  sortOrder: z.number().nonnegative(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const DEFAULT_VALUES: ProjectFormValues = {
  title: "",
  subtitle: "",
  description: "",
  category: null,
  media: null,
  link: null,
  priority: 1,
  sortOrder: 0,
};

export interface ProjectFormProps extends Omit<
  BoxProps<"form">,
  "component" | "onSubmit"
> {
  defaultValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel?: VoidFunction;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  ...props
}) => {
  /** Values */

  const confirm = useConfirm();
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

  /** Effects */

  useBlocker({
    enableBeforeUnload: form.state.isDirty,
    shouldBlockFn: () =>
      form.state.isDirty
        ? confirm({
            title: "Unsaved Changes",
            description: "Are you sure you want to exit?",
          }).then((res) => !res)
        : false,
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
              disabled={field.form.state.isSubmitting}
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
              disabled={field.form.state.isSubmitting}
              error={field.state.meta.isTouched && !field.state.meta.isValid}
              helperText={field.state.meta.errors[0]?.message}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
        <form.Field name="description">
          {(field) => (
            <TextField
              label="Description"
              size="small"
              multiline
              rows={3}
              value={field.state.value}
              disabled={field.form.state.isSubmitting}
              error={field.state.meta.isTouched && !field.state.meta.isValid}
              helperText={field.state.meta.errors[0]?.message}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <form.Field name="media">
          {(field) => (
            <FileUploadField
              label="Media"
              disabled={field.form.state.isSubmitting}
              value={field.state.value}
              onChange={field.handleChange}
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
              disabled={field.form.state.isSubmitting}
              error={field.state.meta.isTouched && !field.state.meta.isValid}
              helperText={field.state.meta.errors[0]?.message}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          {!!onCancel && (
            <Button color="error" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                Submit
              </Button>
            )}
          </form.Subscribe>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProjectForm;
