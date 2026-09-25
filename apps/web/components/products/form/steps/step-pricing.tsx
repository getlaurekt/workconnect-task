"use client"

import { FieldGroup } from "@workspace/ui/components/field"

import { productFormOptions } from "@/components/products/form/product-form-options"
import { ProductFormStepLayout } from "@/components/products/form/product-form-step-layout"
import { withForm } from "@/hooks/form"
import { grossFromNet, netFromGross } from "@/lib/products/pricing"
import { CURRENCIES, VAT_RATES, pricingSchema } from "@/lib/products/schema"

const vatItems = VAT_RATES.map((rate) => ({ value: rate, label: `${rate}%` }))
const currencyItems = CURRENCIES.map((value) => ({ value, label: value }))

export const StepPricing = withForm({
  ...productFormOptions,
  props: { onNext: () => {}, onBack: () => {} },
  render: function StepPricing({ form, onNext, onBack }) {
    function setPrice(
      name: "pricing.priceNet" | "pricing.priceGross",
      value: number | null
    ) {
      form.setFieldValue(name, value, { dontRunListeners: true })
    }

    return (
      <form.FormGroup
        name="pricing"
        validators={{ onChange: pricingSchema }}
        onGroupSubmit={onNext}
      >
        {(group) => (
          <ProductFormStepLayout
            onSubmit={() => group.handleSubmit()}
            onBack={onBack}
          >
            <FieldGroup className="gap-4">
              <div className="grid gap-4 @lg/field-group:grid-cols-2">
                <form.AppField
                  name="pricing.priceNet"
                  listeners={{
                    onChange: ({ value }) =>
                      setPrice(
                        "pricing.priceGross",
                        value === null
                          ? null
                          : grossFromNet(
                              value,
                              form.getFieldValue("pricing.vatRate")
                            )
                      ),
                  }}
                >
                  {(field) => (
                    <field.NumberField
                      label="Cena netto"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  )}
                </form.AppField>
                <form.AppField
                  name="pricing.priceGross"
                  listeners={{
                    onChange: ({ value }) =>
                      setPrice(
                        "pricing.priceNet",
                        value === null
                          ? null
                          : netFromGross(
                              value,
                              form.getFieldValue("pricing.vatRate")
                            )
                      ),
                  }}
                >
                  {(field) => (
                    <field.NumberField
                      label="Cena brutto"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  )}
                </form.AppField>
              </div>

              <div className="grid gap-4 @lg/field-group:grid-cols-2">
                <form.AppField
                  name="pricing.vatRate"
                  listeners={{
                    onChange: ({ value }) => {
                      const net = form.getFieldValue("pricing.priceNet")
                      const gross = form.getFieldValue("pricing.priceGross")
                      if (net !== null) {
                        setPrice("pricing.priceGross", grossFromNet(net, value))
                      } else if (gross !== null) {
                        setPrice("pricing.priceNet", netFromGross(gross, value))
                      }
                    },
                  }}
                >
                  {(field) => (
                    <field.SelectField label="Stawka VAT" items={vatItems} />
                  )}
                </form.AppField>
                <form.AppField name="pricing.currency">
                  {(field) => (
                    <field.SelectField label="Waluta" items={currencyItems} />
                  )}
                </form.AppField>
              </div>
            </FieldGroup>
          </ProductFormStepLayout>
        )}
      </form.FormGroup>
    )
  },
})
