import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:outline focus-visible:outline-offset-1 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:inset-ring aria-invalid:inset-ring-destructive aria-invalid:outline-destructive/20 dark:aria-invalid:outline-destructive/40 [&_svg]:pointer-events-none [&_svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-green-600/10 text-green-600 hover:bg-primary/80 focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:inset-ring focus-visible:inset-ring-outline focus-visible:outline-ring/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground focus-visible:inset-ring focus-visible:inset-ring-outline focus-visible:outline-ring/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive focus-visible:outline-destructive/20 dark:bg-destructive/20 dark:focus-visible:bg-destructive/20 dark:focus-visible:outline-destructive/40",
        outline:
          "bg-background text-foreground inset-ring inset-ring-border hover:bg-muted hover:text-muted-foreground hover:inset-ring hover:inset-ring-border focus-visible:bg-background focus-visible:text-foreground focus-visible:inset-ring focus-visible:inset-ring-outline focus-visible:outline-ring/50",
        ghost:
          "text-foreground hover:bg-muted hover:text-muted-foreground focus-visible:text-foreground focus-visible:outline-ring/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    text?: React.ReactNode
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
  }

function Badge({
  className,
  variant = "default",
  render,
  text = "Dostępny",
  leftIcon,
  rightIcon,
  children,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        children: (
          <>
            {leftIcon && (
              <span data-slot="badge-icon" data-icon="inline-start" aria-hidden>
                {leftIcon}
              </span>
            )}
            {text}
            {children}
            {rightIcon && (
              <span data-slot="badge-icon" data-icon="inline-end" aria-hidden>
                {rightIcon}
              </span>
            )}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
