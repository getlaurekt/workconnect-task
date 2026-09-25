"use client"

import { FieldGroup } from "@workspace/ui/components/field"

import { productFormOptions } from "@/components/products/form/product-form-options"
import { ProductFormStepLayout } from "@/components/products/form/product-form-step-layout"
import { withForm } from "@/hooks/form"
import {
  CATEGORIES,
  FEATURES,
  MANUFACTURERS,
  basicInfoSchema,
} from "@/lib/products/schema"

const manufacturerItems = MANUFACTURERS.map((value) => ({
  value,
  label: value,
}))
const categoryItems = CATEGORIES.map((value) => ({ value, label: value }))
const featureItems = FEATURES.map((value) => ({ value, label: value }))

export const StepBasicInfo = withForm({
  ...productFormOptions,
  props: { onNext: () => {} },
  render: function StepBasicInfo({ form, onNext }) {
    return (
      <form.FormGroup
        name="basicInfo"
        validators={{ onChange: basicInfoSchema }}
        onGroupSubmit={onNext}
      >
        {(group) => (
          <ProductFormStepLayout onSubmit={() => group.handleSubmit()}>
            <FieldGroup className="gap-4">
              <div className="grid gap-4 @lg/field-group:grid-cols-2">
                <form.AppField name="basicInfo.name">
                  {(field) => (
                    <field.TextField
                      label="Nazwa produktu"
                      placeholder="np. MacBook Pro 14"
                    />
                  )}
                </form.AppField>
                <form.AppField name="basicInfo.sku">
                  {(field) => (
                    <field.TextField
                      label="SKU produktu"
                      placeholder="np. MBP14M3PRO"
                    />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="basicInfo.description">
                {(field) => (
                  <field.TextareaField
                    label="Opis"
                    placeholder="Krótki opis produktu"
                  />
                )}
              </form.AppField>

              <div className="grid gap-4 @lg/field-group:grid-cols-2">
                <form.AppField name="basicInfo.manufacturer">
                  {(field) => (
                    <field.SelectField
                      label="Producent"
                      placeholder="Wybierz producenta"
                      items={manufacturerItems}
                    />
                  )}
                </form.AppField>
                <form.AppField name="basicInfo.category">
                  {(field) => (
                    <field.SelectField
                      label="Kategoria"
                      placeholder="Wybierz kategorię"
                      items={categoryItems}
                    />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="basicInfo.features">
                {(field) => (
                  <field.ToggleGroupField
                    label="Cechy produktu"
                    items={featureItems}
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </ProductFormStepLayout>
        )}
      </form.FormGroup>
    )
  },
})
