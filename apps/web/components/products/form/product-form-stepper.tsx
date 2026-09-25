import { Fragment } from "react"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { CheckIcon } from "lucide-react"

export const PRODUCT_FORM_STEPS = [
  { title: "Informacje", description: "Dane podstawowe" },
  { title: "Cena", description: "Dane cenowe" },
  { title: "Dostępność", description: "Stany magazynowe" },
] as const

export type ProductFormStep = 1 | 2 | 3

type StepStatus = "complete" | "current" | "upcoming"

function getStatus(stepNumber: number, currentStep: number): StepStatus {
  if (stepNumber < currentStep) return "complete"
  if (stepNumber === currentStep) return "current"
  return "upcoming"
}

export function ProductFormStepper({
  currentStep,
  className,
}: {
  currentStep: ProductFormStep
  className?: string
}) {
  return (
    <div
      aria-label="Kroki formularza"
      className={cn(
        "mx-4 grid grid-cols-3 gap-4 border-y py-6 @xl/dialog:mx-0 @xl/dialog:flex @xl/dialog:items-center @xl/dialog:border-t-0 @xl/dialog:px-4 @xl/dialog:py-3",
        className
      )}
    >
      {PRODUCT_FORM_STEPS.map((step, index) => {
        const stepNumber = index + 1
        const status = getStatus(stepNumber, currentStep)

        return (
          <Fragment key={step.title}>
            {index > 0 && (
              <Separator
                aria-hidden
                className={cn(
                  "hidden max-w-16 min-w-4 flex-1 @xl/dialog:block",
                  status !== "upcoming" && "bg-blue-600"
                )}
              />
            )}
            <div
              aria-current={status === "current" ? "step" : undefined}
              className="flex min-w-0 flex-col items-start gap-3 @xl/dialog:shrink-0 @xl/dialog:flex-row @xl/dialog:items-center"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  status === "upcoming"
                    ? "border bg-accent text-muted-foreground"
                    : "bg-blue-600 text-primary-foreground"
                )}
              >
                {status === "complete" ? (
                  <CheckIcon className="size-4" aria-label="Ukończono" />
                ) : (
                  stepNumber
                )}
              </span>
              <span className="flex flex-col gap-0.5 whitespace-nowrap">
                <span
                  className={cn(
                    "text-sm font-medium",
                    status === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {step.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {step.description}
                </span>
              </span>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}
