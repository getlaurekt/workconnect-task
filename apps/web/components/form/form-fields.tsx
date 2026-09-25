"use client"

import { useId, type ComponentProps, type ReactNode } from "react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

import { useFieldContext } from "@/hooks/form-context"

type ControlledProps = "id" | "name" | "value" | "onChange" | "onBlur"

function isFieldInvalid(meta: { isTouched: boolean; isValid: boolean }) {
  return meta.isTouched && !meta.isValid
}

function useFieldIds() {
  const id = useId()
  return { id, errorId: `${id}-error` }
}

function FormField({
  id,
  errorId,
  label,
  children,
}: {
  id: string
  errorId: string
  label: string
  children: (invalid: boolean) => ReactNode
}) {
  const field = useFieldContext<unknown>()
  const invalid = isFieldInvalid(field.state.meta)

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children(invalid)}
      {invalid && <FieldError id={errorId} errors={field.state.meta.errors} />}
    </Field>
  )
}

export function TextField({
  label,
  ...props
}: { label: string } & Omit<ComponentProps<typeof Input>, ControlledProps>) {
  const field = useFieldContext<string>()
  const { id, errorId } = useFieldIds()

  return (
    <FormField id={id} errorId={errorId} label={label}>
      {(invalid) => (
        <Input
          {...props}
          id={id}
          name={field.name}
          value={field.state.value}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
        />
      )}
    </FormField>
  )
}

export function TextareaField({
  label,
  ...props
}: { label: string } & Omit<ComponentProps<typeof Textarea>, ControlledProps>) {
  const field = useFieldContext<string | undefined>()
  const { id, errorId } = useFieldIds()

  return (
    <FormField id={id} errorId={errorId} label={label}>
      {(invalid) => (
        <Textarea
          {...props}
          id={id}
          name={field.name}
          value={field.state.value ?? ""}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
        />
      )}
    </FormField>
  )
}

export function NumberField({
  label,
  ...props
}: { label: string } & Omit<
  ComponentProps<typeof Input>,
  ControlledProps | "type"
>) {
  const field = useFieldContext<number | null>()
  const { id, errorId } = useFieldIds()

  return (
    <FormField id={id} errorId={errorId} label={label}>
      {(invalid) => (
        <Input
          {...props}
          type="number"
          id={id}
          name={field.name}
          value={field.state.value ?? ""}
          onChange={(event) =>
            field.handleChange(
              event.target.value === "" ? null : event.target.valueAsNumber
            )
          }
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
        />
      )}
    </FormField>
  )
}

export function SelectField<Value>({
  label,
  placeholder,
  items,
}: {
  label: string
  placeholder?: string
  items: ReadonlyArray<{ value: Value; label: string }>
}) {
  const field = useFieldContext<Value | null>()
  const { id, errorId } = useFieldIds()

  return (
    <FormField id={id} errorId={errorId} label={label}>
      {(invalid) => (
        <Select
          items={items}
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
        >
          <SelectTrigger
            id={id}
            className="w-full"
            onBlur={field.handleBlur}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={String(item.value)} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}

export function ToggleGroupField<Value extends string>({
  label,
  items,
}: {
  label: string
  items: ReadonlyArray<{ value: Value; label: string }>
}) {
  const field = useFieldContext<Value[]>()
  const { id, errorId } = useFieldIds()
  const invalid = isFieldInvalid(field.state.meta)

  return (
    <Field data-invalid={invalid}>
      <FieldTitle id={id}>{label}</FieldTitle>
      <ToggleGroup
        multiple
        variant="outline"
        size="sm"
        aria-labelledby={id}
        aria-describedby={invalid ? errorId : undefined}
        className="flex-wrap"
        value={field.state.value}
        onValueChange={(values) =>
          field.handleChange(
            values.filter((value): value is Value =>
              items.some((item) => item.value === value)
            )
          )
        }
      >
        {items.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {invalid && <FieldError id={errorId} errors={field.state.meta.errors} />}
    </Field>
  )
}

export function SwitchField({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const id = useId()

  return (
    <Field orientation="horizontal">
      <Switch
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
      />
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
    </Field>
  )
}

export function CheckboxField({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const id = useId()

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
      />
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
    </Field>
  )
}
