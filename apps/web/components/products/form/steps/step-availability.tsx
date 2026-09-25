"use client"

import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field"
import { Separator } from "@workspace/ui/components/separator"

import { productFormOptions } from "@/components/products/form/product-form-options"
import { ProductFormStepLayout } from "@/components/products/form/product-form-step-layout"
import { withForm } from "@/hooks/form"
import { availabilitySchema } from "@/lib/products/schema"

export const StepAvailability = withForm({
  ...productFormOptions,
  props: { onBack: () => {} },
  render: function StepAvailability({ form, onBack }) {
    return (
      <form.FormGroup
        name="availability"
        validators={{ onChange: availabilitySchema }}
        onGroupSubmit={() => form.handleSubmit()}
      >
        {(group) => (
          <form.Subscribe
            selector={(state) => state.isSubmitting || state.isSubmitSuccessful}
          >
            {(isSaving) => (
              <ProductFormStepLayout
                onSubmit={() => group.handleSubmit()}
                onBack={onBack}
                isLastStep
                isSubmitDisabled={isSaving}
              >
                <FieldGroup className="gap-4">
                  <form.AppField name="availability.available">
                    {(field) => (
                      <field.SwitchField label="Produkt jest dostępny" />
                    )}
                  </form.AppField>

                  <Separator />

                  <form.AppField name="availability.limited">
                    {(field) => (
                      <field.CheckboxField label="Produkt limitowany" />
                    )}
                  </form.AppField>

                  <form.Subscribe
                    selector={(state) => state.values.availability.limited}
                  >
                    {(limited) =>
                      limited && (
                        <form.AppField name="availability.stock">
                          {(field) => (
                            <field.NumberField
                              label="Ilość na magazynie"
                              inputMode="numeric"
                              min="0"
                              step="1"
                              placeholder="0"
                            />
                          )}
                        </form.AppField>
                      )
                    }
                  </form.Subscribe>

                  <Separator />

                  <FieldSet>
                    <FieldLegend className="mb-4">Limity koszyka</FieldLegend>
                    <div className="grid gap-4 @lg/field-group:grid-cols-2">
                      <form.AppField name="availability.minCartQty">
                        {(field) => (
                          <field.NumberField
                            label="Minimalna ilość"
                            inputMode="numeric"
                            min="1"
                            step="1"
                          />
                        )}
                      </form.AppField>
                      <form.AppField name="availability.maxCartQty">
                        {(field) => (
                          <field.NumberField
                            label="Maksymalna ilość"
                            inputMode="numeric"
                            min="1"
                            step="1"
                          />
                        )}
                      </form.AppField>
                    </div>
                  </FieldSet>
                </FieldGroup>
              </ProductFormStepLayout>
            )}
          </form.Subscribe>
        )}
      </form.FormGroup>
    )
  },
})
