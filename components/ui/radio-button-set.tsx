'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/utils'

export type RadioButtonSetOption = {
  value: string
  label: string
  disabled?: boolean
}

export type RadioButtonSetProps = Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>,
  'children' | 'dir'
> & {
  options: RadioButtonSetOption[]
  className?: string
}

/**
 * Segmented single-choice control: options share one rounded border; dividers between
 * segments; checked segment uses primary fill (no separate radio circle).
 */
export function RadioButtonSet({ className, options, ...props }: RadioButtonSetProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-button-set"
      className={cn(
        'inline-block overflow-hidden rounded-lg border border-input bg-background shadow-xs',
        className,
      )}
      {...props}
    >
      {options.map((opt, index) => (
        <RadioGroupPrimitive.Item
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          data-slot="radio-button-set-item"
          className={cn(
            'relative flex-1 cursor-pointer px-2 py-1.5 text-center text-xs font-medium outline-none transition-colors sm:px-3 sm:text-sm',
            'border-0 shadow-none',
            'focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
            'data-[state=checked]:z-[1] data-[state=checked]:bg-accent/80 data-[state=checked]:text-primary',
            'data-[state=unchecked]:text-foreground data-[state=unchecked]:hover:bg-accent/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            index > 0 && 'border-l border-input',
          )}
        >
          {opt.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
