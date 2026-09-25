import { createFormHook } from "@tanstack/react-form-nextjs"

import {
  CheckboxField,
  NumberField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
  ToggleGroupField,
} from "@/components/form/form-fields"
import { fieldContext, formContext } from "@/hooks/form-context"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NumberField,
    SelectField,
    ToggleGroupField,
    SwitchField,
    CheckboxField,
  },
  formComponents: {},
})
