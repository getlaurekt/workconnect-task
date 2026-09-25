"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-background inset-ring inset-ring-input transition-colors outline-none group-active/field-label:opacity-60 group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:shadow-outline focus-visible:inset-ring-ring active:opacity-60 aria-checked:bg-primary aria-checked:text-primary-foreground aria-checked:inset-ring-primary aria-invalid:shadow-none aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive dark:bg-input/30 dark:aria-checked:bg-primary dark:aria-invalid:ring-destructive/40 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:group-active/field-label:opacity-50 data-disabled:active:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
