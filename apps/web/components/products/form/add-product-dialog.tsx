"use client"

import { useState } from "react"
import { revalidateLogic } from "@tanstack/react-form-nextjs"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { PlusIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { productFormOptions } from "@/components/products/form/product-form-options"
import {
  ProductFormStepper,
  type ProductFormStep,
} from "@/components/products/form/product-form-stepper"
import { StepAvailability } from "@/components/products/form/steps/step-availability"
import { StepBasicInfo } from "@/components/products/form/steps/step-basic-info"
import { StepPricing } from "@/components/products/form/steps/step-pricing"
import { useAppForm } from "@/hooks/form"
import {
  productFormSchema,
  productSchema,
  type Product,
} from "@/lib/products/schema"

export function AddProductDialog({
  onAdd,
}: {
  onAdd: (product: Product) => void
}) {
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setFormKey((key) => key + 1)
        setOpen(nextOpen)
      }}
    >
      <DialogTrigger render={<Button size="lg" />}>
        <PlusIcon data-icon="inline-start" />
        Dodaj produkt
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="@container/dialog flex flex-col gap-0 p-0 transition-none max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none sm:max-h-[calc(100dvh-2rem)] sm:max-w-[min(45rem,100%-2rem)]"
      >
        <AddProductForm
          key={formKey}
          onSave={(product) => {
            onAdd(product)
            setOpen(false)
            toast.success("Produkt został dodany")
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

function AddProductForm({ onSave }: { onSave: (product: Product) => void }) {
  const [step, setStep] = useState<ProductFormStep>(1)
  const form = useAppForm({
    ...productFormOptions,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: productFormSchema },
    onSubmit: ({ value }) =>
      onSave(
        productSchema.parse({
          id: crypto.randomUUID(),
          ...value.basicInfo,
          ...value.pricing,
          ...value.availability,
        })
      ),
  })

  return (
    <>
      <DialogHeader className="flex-row items-center justify-between gap-2 px-4 pt-6 pb-4 @xl/dialog:border-b @xl/dialog:py-6">
        <DialogTitle>Dodaj nowy produkt</DialogTitle>
        <DialogClose
          aria-label="Zamknij"
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-my-1.5 -mr-1.5"
            />
          }
        >
          <XIcon className="opacity-70" />
        </DialogClose>
      </DialogHeader>

      <ProductFormStepper currentStep={step} />

      {step === 1 && <StepBasicInfo form={form} onNext={() => setStep(2)} />}
      {step === 2 && (
        <StepPricing
          form={form}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <StepAvailability form={form} onBack={() => setStep(2)} />}
    </>
  )
}
