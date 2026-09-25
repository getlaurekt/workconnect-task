import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { DialogFooter } from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

type ProductFormStepLayoutProps = {
  onSubmit: () => void
  onBack?: () => void
  isLastStep?: boolean
  isSubmitDisabled?: boolean
  children: ReactNode
}

export function ProductFormStepLayout({
  onSubmit,
  onBack,
  isLastStep = false,
  isSubmitDisabled = false,
  children,
}: ProductFormStepLayoutProps) {
  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-4 pb-4 @xl/dialog:py-5">
        {children}
      </div>

      <DialogFooter
        className={cn(
          "mx-0 mb-0 flex-row items-center max-sm:rounded-none",
          onBack ? "justify-between" : "justify-end"
        )}
      >
        {onBack && (
          <Button type="button" variant="outline" size="lg" onClick={onBack}>
            <ArrowLeftIcon data-icon="inline-start" />
            Wstecz
          </Button>
        )}
        <Button type="submit" size="lg" disabled={isSubmitDisabled}>
          {isLastStep ? (
            "Zapisz produkt"
          ) : (
            <>
              Dalej
              <ArrowRightIcon data-icon="inline-end" />
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
