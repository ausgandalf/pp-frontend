import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'rounded-md border border-[#101925] bg-gradient-to-b from-[#3a4a72] to-[#243148] font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),inset_0_-1px_0_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.38),0_-1px_0_rgba(0,0,0,0.15)] transition-all duration-200 hover:border-[#2d4058] hover:from-[#4a608e] hover:to-[#2f4568] hover:text-[#fcfaf6] hover:[text-shadow:0_1px_1px_rgba(0,0,0,0.28)] active:brightness-[0.97] focus-visible:ring-primary/45 dark:border-[#0a101c] dark:from-[#425785] dark:to-[#2a3550] dark:text-[#f5f2eb] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)] dark:[text-shadow:0_1px_1px_rgba(0,0,0,0.45),0_-1px_0_rgba(0,0,0,0.2)] dark:hover:border-[#2a3a52] dark:hover:from-[#506a9e] dark:hover:to-[#364d78] dark:hover:text-white dark:hover:[text-shadow:0_1px_1px_rgba(0,0,0,0.35)] dark:active:brightness-[0.97]',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        /** Gold CTA: warm gold fill, mild brown frame, inset highlights, white label */
        gold:
          'rounded-md border border-[#8f7d66] bg-gradient-to-b from-[#d2b068] to-[#c19a4e] font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,248,225,0.42),inset_0_-1px_0_0_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.12)] [text-shadow:0_1px_1px_rgba(0,0,0,0.5),0_-1px_0_rgba(0,0,0,0.18)] transition-[filter,box-shadow,transform] hover:brightness-[1.03] hover:shadow-[inset_0_1px_0_0_rgba(255,248,225,0.5),inset_0_-1px_0_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.14)] active:translate-y-px active:brightness-[0.98] active:shadow-[inset_0_1px_0_0_rgba(255,248,225,0.32),inset_0_-1px_0_0_rgba(0,0,0,0.16),inset_0_2px_4px_rgba(0,0,0,0.12)] focus-visible:ring-[#c6aa76]/55',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn("cursor-pointer", buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
