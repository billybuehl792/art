import React, { type SubmitEventHandler } from "react";
import { useBlocker } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  type BoxProps,
} from "@mui/material";
import useConfirm from "@/hooks/useConfirm";
import FileUploadField from "@/components/fields/FileUploadField";
import ExternalLinkField from "@/components/fields/ExternalLinkField";
import { projectCategoryEnum } from "@/schemas/projects";

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const projectFormSchema = z.object({
  category: projectCategoryEnum,
  title: z.string().trim().min(1),
  subtitle: z.string(),
  description: z.string(),
  link: z.url().nullable(),
  media: z.custom<File>((value) => value instanceof File).nullable(),
  priority: z.number().min(0).max(10),
});

const DEFAULT_VALUES: ProjectFormValues = {
  category: "art",
  title: "",
  subtitle: "",
  description: "",
  link: null,
  media: null,
  priority: 0,
};

export interface ProjectFormProps extends Omit<
  BoxProps<"form">,
  "component" | "onSubmit" | "onReset"
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

  /** Callbacks */

  const handleOnSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    void form.handleSubmit();
  };

  const handleOnReset: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    void form.reset();
  };

  /** Effects */

  useBlocker({
    enableBeforeUnload: form.state.isDirty && !form.state.isDefaultValue,
    shouldBlockFn: () =>
      form.state.isDirty && !form.state.isDefaultValue
        ? confirm({
            title: "Unsaved Changes",
            description: "Changes will be lost. Are you sure you want to exit?",
            confirmButton: { children: "Exit", color: "error" },
            cancelButton: { color: "primary" },
          }).then((confirmed) => !confirmed)
        : false,
  });

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      {...props}
      onSubmit={handleOnSubmit}
      onReset={handleOnReset}
    >
      <Stack spacing={2}>
        <form.Subscribe
          selector={(state) => ({ disabled: state.isSubmitting })}
        >
          {({ disabled }) => (
            <Stack spacing={2}>
              <form.Field name="category">
                {(field) => (
                  <FormControl>
                    <FormLabel component="div" id={`${field.name}-label`}>
                      Category
                    </FormLabel>
                    <RadioGroup
                      name={field.name}
                      value={field.state.value}
                      row
                      aria-labelledby={`${field.name}-label`}
                      onChange={(_, value) =>
                        field.handleChange(projectCategoryEnum.parse(value))
                      }
                    >
                      {projectCategoryEnum.options.map((category) => (
                        <FormControlLabel
                          key={category}
                          value={category}
                          disabled={disabled}
                          control={<Radio size="small" />}
                          label={category}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </form.Field>

              <form.Field
                name="title"
                children={({ state, handleBlur, handleChange }) => (
                  <TextField
                    label="Title"
                    placeholder="Project Title"
                    value={state.value}
                    disabled={disabled}
                    error={!state.meta.isValid}
                    helperText={state.meta.errors[0]?.message}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                  />
                )}
              />

              <form.Field
                name="subtitle"
                children={({ state, handleBlur, handleChange }) => (
                  <TextField
                    label="Subtitle"
                    placeholder="Project Subtitle"
                    value={state.value}
                    disabled={disabled}
                    error={state.meta.isTouched && !state.meta.isValid}
                    helperText={state.meta.errors[0]?.message}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                  />
                )}
              />

              <form.Field
                name="description"
                children={(field) => (
                  <TextField
                    label="Description"
                    placeholder="Project Description"
                    multiline
                    rows={3}
                    value={field.state.value}
                    disabled={disabled}
                    error={!field.state.meta.isValid}
                    helperText={field.state.meta.errors[0]?.message}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                )}
              />

              <form.Field name="link">
                {(field) => (
                  <ExternalLinkField
                    label="Link"
                    value={field.state.value || ""}
                    disabled={disabled}
                    error={!field.state.meta.isValid}
                    helperText={field.state.meta.errors[0]?.message}
                    onChange={(e) => field.handleChange(e.target.value || null)}
                    onBlur={field.handleBlur}
                  />
                )}
              </form.Field>

              <form.Field name="media">
                {(field) => (
                  <FileUploadField
                    label="Media"
                    disabled={disabled}
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
                    disabled={disabled}
                    error={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                    helperText={field.state.meta.errors[0]?.message}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    onBlur={field.handleBlur}
                    slotProps={{
                      htmlInput: { min: 1, max: 10, step: 1 },
                    }}
                  />
                )}
              </form.Field>
            </Stack>
          )}
        </form.Subscribe>

        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
          {!!onCancel && (
            <Button color="error" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {({ canSubmit, isSubmitting }) => (
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
