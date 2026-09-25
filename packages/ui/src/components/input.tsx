import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const inputVariants = cva(
  "h-8 w-full min-w-0 rounded-full bg-transparent py-1 pr-2.5 pl-3 text-sm text-foreground inset-ring inset-ring-input transition-colors outline-none placeholder:text-muted-foreground focus-visible:text-foreground focus-visible:shadow-outline focus-visible:inset-ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:text-foreground disabled:opacity-50 disabled:inset-ring-input aria-invalid:bg-background aria-invalid:shadow-none aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:inset-ring-destructive dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:bg-background dark:aria-invalid:bg-linear-to-r dark:aria-invalid:from-input/30 dark:aria-invalid:to-input/30 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "focus-visible:bg-background aria-invalid:text-destructive dark:focus-visible:bg-input/30",
        file: "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:bg-background aria-invalid:text-foreground dark:focus-visible:bg-input/30",
        password:
          "focus-visible:bg-transparent aria-invalid:text-destructive dark:focus-visible:bg-input/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>

function variantForType(type: InputProps["type"]) {
  if (type === "file") return "file"
  if (type === "password") return "password"
  return "default"
}

function Input({ className, type, variant, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({ variant: variant ?? variantForType(type) }),
        className
      )}
      {...props}
    />
  )
}

export { Input, inputVariants }
