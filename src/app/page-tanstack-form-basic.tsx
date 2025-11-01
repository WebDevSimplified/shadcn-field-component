"use client";

import { createProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_STATUSES, projectSchema } from "@/schemas/project";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";

type FormData = z.infer<typeof projectSchema>;

export default function HomePage() {
  const form = useForm({
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
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Project name"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="status">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select
                    onValueChange={(e) =>
                      field.handleChange(e as (typeof PROJECT_STATUSES)[number])
                    }
                    value={field.state.value}
                  >
                    <SelectTrigger aria-invalid={isInvalid} id={field.name}>
                      <SelectValue
                        onBlur={field.handleBlur}
                        placeholder="Select status"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <FieldDescription>
                      Be as detailed as possible
                    </FieldDescription>
                  </FieldContent>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Project description"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <FieldSet>
            <FieldContent>
              <FieldLegend>Notifications</FieldLegend>
              <FieldDescription>
                Select how you would like to receive notifications.
              </FieldDescription>
            </FieldContent>
            <FieldGroup data-slot="checkbox-group">
              <form.Field name="notifications.email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onBlur={field.handleBlur}
                        onCheckedChange={(e) => field.handleChange(e === true)}
                        aria-invalid={isInvalid}
                      />
                      <FieldLabel className="font-normal" htmlFor={field.name}>
                        Email
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="notifications.sms">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onBlur={field.handleBlur}
                        onCheckedChange={(e) => field.handleChange(e === true)}
                        aria-invalid={isInvalid}
                      />
                      <FieldLabel className="font-normal" htmlFor={field.name}>
                        Text
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="notifications.push">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onBlur={field.handleBlur}
                        onCheckedChange={(e) => field.handleChange(e === true)}
                        aria-invalid={isInvalid}
                      />
                      <FieldLabel className="font-normal" htmlFor={field.name}>
                        In App
                      </FieldLabel>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <form.Field name="users" mode="array">
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
                      <form.Field key={index} name={`users[${index}].email`}>
                        {(innerField) => {
                          const isInvalid =
                            innerField.state.meta.isTouched &&
                            !innerField.state.meta.isValid;
                          return (
                            <Field
                              orientation="horizontal"
                              data-invalid={isInvalid}
                            >
                              <FieldContent>
                                <InputGroup>
                                  <InputGroupInput
                                    id={innerField.name}
                                    aria-invalid={isInvalid}
                                    aria-label={`User ${index + 1} email`}
                                    type="email"
                                    onBlur={innerField.handleBlur}
                                    onChange={(e) =>
                                      innerField.handleChange(e.target.value)
                                    }
                                    value={innerField.state.value}
                                    placeholder="User Email"
                                  />
                                  {field.state.value.length > 1 && (
                                    <InputGroupAddon align="inline-end">
                                      <InputGroupButton
                                        type="button"
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={() => field.removeValue(index)}
                                        aria-label={`Remove User ${index + 1}`}
                                      >
                                        <XIcon />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  )}
                                </InputGroup>
                                {isInvalid && (
                                  <FieldError
                                    errors={innerField.state.meta.errors}
                                  />
                                )}
                              </FieldContent>
                            </Field>
                          );
                        }}
                      </form.Field>
                    ))}
                  </FieldGroup>
                </FieldSet>
              );
            }}
          </form.Field>

          <Button type="submit">Create</Button>
        </FieldGroup>
      </form>
    </div>
  );
}
