"use client";

import { createProject } from "@/actions/project";
import { FormCheckbox } from "@/components/form/react-hook-form/FormCheckbox";
import { FormInput } from "@/components/form/react-hook-form/FormInput";
import { FormSelect } from "@/components/form/react-hook-form/FormSelect";
import { FormTextarea } from "@/components/form/react-hook-form/FormTextarea";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function HomePage() {
  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      users: [{ email: "" }],
      status: "draft" as const,
      notifications: {
        email: false,
        sms: false,
        push: false,
      },
    },
  });

  const {
    fields: users,
    append: addUser,
    remove: removeUser,
  } = useFieldArray({
    control: form.control,
    name: "users",
  });

  async function onSubmit(data: z.infer<typeof projectSchema>) {
    const res = await createProject(data);

    if (res.success) {
      form.reset();
      toast.success("Project created successfully!", {
        description: JSON.stringify(data, null, 2),
        className: "whitespace-pre-wrap font-mono",
      });
    } else {
      toast.error("Failed to create project.");
    }
  }

  return (
    <div className="container px-4 mx-auto my-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="name"
            label="Name"
            type="text"
            placeholder="Project Name"
          />

          <FormSelect
            control={form.control}
            name="status"
            label="Status"
            placeholder="Select status"
          >
            {PROJECT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </FormSelect>

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            description="Be as detailed as possible"
            placeholder="Project description"
          />

          <FieldSet>
            <FieldLegend>Notifications</FieldLegend>
            <FieldDescription>
              Select how you would like to receive notifications.
            </FieldDescription>
            <FieldGroup data-slot="checkbox-group">
              <FormCheckbox
                name="notifications.email"
                label="Email"
                control={form.control}
              />
              <FormCheckbox
                name="notifications.sms"
                label="Text"
                control={form.control}
              />
              <FormCheckbox
                name="notifications.push"
                label="In App"
                control={form.control}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <FieldSet>
            <div className="flex justify-between gap-2 items-center">
              <FieldContent>
                <FieldLegend variant="label" className="mb-0">
                  User Email Addresses
                </FieldLegend>
                <FieldDescription>
                  Add up to 5 users to this project (including yourself).
                </FieldDescription>
                {form.formState.errors.users?.root && (
                  <FieldError errors={[form.formState.errors.users.root]} />
                )}
              </FieldContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addUser({ email: "" })}
              >
                Add User
              </Button>
            </div>
            <FieldGroup>
              {users.map((user, index) => (
                <Controller
                  key={user.id}
                  name={`users.${index}.email`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id={`${field.name}-${index}`}
                            aria-invalid={fieldState.invalid}
                            aria-label={`User ${index + 1} email`}
                            type="email"
                            placeholder="User Email"
                          />
                          {users.length > 1 && (
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => removeUser(index)}
                                aria-label={`Remove User ${index + 1}`}
                              >
                                <XIcon />
                              </InputGroupButton>
                            </InputGroupAddon>
                          )}
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
              ))}
            </FieldGroup>
          </FieldSet>
          <Button type="submit">Create</Button>
        </FieldGroup>
      </form>
    </div>
  );
}
