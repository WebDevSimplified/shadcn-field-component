"use client";

import { createProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SelectItem } from "@/components/ui/select";
import { PROJECT_STATUSES, projectSchema } from "@/schemas/project";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/form/tanstack-form/hooks";

type FormData = z.infer<typeof projectSchema>;

export default function HomePage() {
  const form = useAppForm({
    defaultValues: {
      name: "",
      description: "",
      users: [{ email: "" }],
      status: "draft",
      notifications: {
        email: false,
        sms: false,
        push: false,
      },
    } satisfies FormData as FormData,
    validators: {
      onSubmit: projectSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await createProject(value);

      if (res.success) {
        form.reset();
        toast.success("Project created successfully!", {
          description: JSON.stringify(value, null, 2),
          className: "whitespace-pre-wrap font-mono",
        });
      } else {
        toast.error("Failed to create project.");
      }
    },
  });

  return (
    <div className="container px-4 mx-auto my-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Name"
                type="text"
                placeholder="Project Name"
              />
            )}
          </form.AppField>

          <form.AppField name="status">
            {(field) => (
              <field.Select label="Status" placeholder="Select status">
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>

          <form.AppField name="description">
            {(field) => (
              <field.Textarea
                label="Description"
                description="Be as specific as possible"
                placeholder="Project Description"
              />
            )}
          </form.AppField>

          <FieldSet>
            <FieldContent>
              <FieldLegend>Notifications</FieldLegend>
              <FieldDescription>
                Select how you would like to receive notifications.
              </FieldDescription>
            </FieldContent>

            <FieldGroup data-slot="checkbox-group">
              <form.AppField name="notifications.email">
                {(field) => <field.Checkbox label="Email" />}
              </form.AppField>

              <form.AppField name="notifications.sms">
                {(field) => <field.Checkbox label="Text" />}
              </form.AppField>

              <form.AppField name="notifications.push">
                {(field) => <field.Checkbox label="In App" />}
              </form.AppField>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <form.AppField name="users" mode="array">
            {(field) => {
              return (
                <FieldSet>
                  <div className="flex justify-between gap-2 items-center">
                    <FieldContent>
                      <FieldLegend variant="label" className="mb-0">
                        User Email Addresses
                      </FieldLegend>
                      <FieldDescription>
                        Add up to 5 users to this project (including yourself).
                      </FieldDescription>
                      {field.state.meta.errors && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </FieldContent>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.pushValue({ email: "" })}
                    >
                      Add User
                    </Button>
                  </div>

                  <FieldGroup>
                    {field.state.value.map((_, index) => (
                      <form.AppField key={index} name={`users[${index}].email`}>
                        {(innerField) => {
                          const isInvalid =
                            innerField.state.meta.isTouched &&
                            !innerField.state.meta.isValid;

                          return (
                            <Field data-invalid={isInvalid}>
                              <InputGroup>
                                <InputGroupInput
                                  type="email"
                                  id={innerField.name}
                                  aria-invalid={isInvalid}
                                  aria-label={`User ${index + 1} email`}
                                  onBlur={innerField.handleBlur}
                                  onChange={(e) =>
                                    innerField.handleChange(e.target.value)
                                  }
                                  value={innerField.state.value}
                                  placeholder="User Email"
                                />
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => field.removeValue(index)}
                                    aria-label={`Remove user ${index + 1}`}
                                  >
                                    <XIcon />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              </InputGroup>

                              {isInvalid && (
                                <FieldError
                                  errors={innerField.state.meta.errors}
                                />
                              )}
                            </Field>
                          );
                        }}
                      </form.AppField>
                    ))}
                  </FieldGroup>
                </FieldSet>
              );
            }}
          </form.AppField>

          <Button>Create</Button>
        </FieldGroup>
      </form>
    </div>
  );
}
